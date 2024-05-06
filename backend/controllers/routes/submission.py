import datetime
import hashlib
import pathlib

from fastapi import APIRouter, BackgroundTasks, Response, UploadFile
from sqlmodel import Session
from starlette.requests import Request

from controllers.authentication.role_dependencies import ensure_student_in_group, ensure_user_authorized_for_submission
from controllers.swagger_tags import Tags
from db.extensions import engine
from db.models import Submission, SubmissionState
from domain.logic.docker import run_container
from domain.logic.errors import InvalidSubmissionError
from domain.logic.group import get_group
from domain.logic.submission import check_submission, create_submission, get_last_submission, get_submission

submission_router = APIRouter(tags=[Tags.SUBMISSION])


def run_docker_checks(submission_id: int) -> None:
    with Session(engine) as session:
        submission = get_submission(session, submission_id)
        with open(submission.filename, "rb") as file:
            submission_file = file.read()
        logs, res = run_container(submission.group.project.image_id, submission_file)
        if res:
            submission.state = SubmissionState.Approved
        else:
            submission.state = SubmissionState.Rejected
        submission.message = logs
        session.commit()


@submission_router.post("/groups/{group_id}/submission", summary="Make a submission.")
def make_submission(request: Request, group_id: int, file: UploadFile, tasks: BackgroundTasks) -> Submission:
    session = request.state.session
    student = ensure_student_in_group(request, group_id)
    if file.filename is None or ".." in file.filename or file.filename == ".":
        raise InvalidSubmissionError
    for i in file.filename:
        if not i.isalnum() and i != "." and i != "_" and i != "-":
            raise InvalidSubmissionError
    file_content = file.file.read()
    sha256 = hashlib.sha256(file_content).hexdigest()
    dirname = f"submissions/{sha256}-{file.filename}"
    pathlib.Path.mkdir(pathlib.Path(dirname), exist_ok=True)
    filename = f"{dirname}/{file.filename}"
    with open(filename, "wb") as f:
        f.write(file_content)
    project = get_group(session, group_id).project
    if project.requirements != "":
        check_submission(session, group_id, dirname)

    state = SubmissionState.Approved if project.image_id == "" else SubmissionState.Pending

    submission = create_submission(
        session=session,
        student_id=student.id,
        group_id=group_id,
        message="",
        state=state,
        date_time=datetime.datetime.now(),
        filename=filename,
    )
    if state == SubmissionState.Pending:
        tasks.add_task(run_docker_checks, submission.id)
    return submission


@submission_router.get("/groups/{group_id}/submission", summary="Get latest submission.")
def retrieve_submission(request: Request, group_id: int) -> Submission:
    session = request.state.session
    ensure_user_authorized_for_submission(request, group_id)
    return get_last_submission(session, group_id)


@submission_router.get("/groups/{group_id}/submission/file", summary="Get last submission")
def retrieve_submission_file(request: Request, group_id: int) -> Response:
    session = request.state.session
    ensure_user_authorized_for_submission(request, group_id)

    submission = get_last_submission(session, group_id)
    with open(submission.filename, "rb") as file:
        content = file.read()
        return Response(content, media_type="application/octet-stream")
