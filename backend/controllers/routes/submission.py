import datetime

from fastapi import APIRouter, BackgroundTasks, Response, UploadFile
from sqlmodel import Session
from starlette.requests import Request

from controllers.authentication.role_dependencies import ensure_student_in_group, ensure_user_authorized_for_submission
from controllers.swagger_tags import Tags
from db.extensions import engine
from db.models import Submission, SubmissionState
from domain.logic.docker import run_container
from domain.logic.submission import create_submission, get_last_submission, get_submission

submission_router = APIRouter(tags=[Tags.SUBMISSION])


def run_docker_checks(submission_id: int) -> None:
    with Session(engine) as session:
        submission = get_submission(session, submission_id)
        logs, res = run_container(submission.group.project.image_id, submission.filename)
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
    file_content = file.file.read()
    submission = create_submission(
        session=session,
        student_id=student.id,
        group_id=group_id,
        date_time=datetime.datetime.now(),
        original_filename=str(file.filename),
        file_content=file_content,
    )
    if submission.state == SubmissionState.Pending:
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
