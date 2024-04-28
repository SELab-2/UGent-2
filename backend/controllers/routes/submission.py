import datetime
import hashlib
import pathlib

from fastapi import APIRouter, Response, UploadFile
from starlette.requests import Request

from controllers.authentication.role_dependencies import ensure_student_in_group, ensure_user_authorized_for_submission
from controllers.swagger_tags import Tags
from db.models import Submission, SubmissionState
from domain.logic.errors import InvalidSubmissionError
from domain.logic.group import get_group
from domain.logic.submission import check_submission, create_submission, get_last_submission

submission_router = APIRouter(tags=[Tags.SUBMISSION])


@submission_router.post("/groups/{group_id}/submission", summary="Make a submission.")
def make_submission(request: Request, group_id: int, file: UploadFile) -> Submission:
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
    check_submission(session, group_id, dirname)

    project = get_group(session, group_id).project
    state = SubmissionState.Approved if project.image_id == "" else SubmissionState.Pending

    return create_submission(
        session=session,
        student_id=student.id,
        group_id=group_id,
        message="",
        state=state,
        date_time=datetime.datetime.now(),
        filename=filename,
    )


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
