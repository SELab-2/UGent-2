import datetime
import hashlib
from typing import Annotated

from fastapi import APIRouter, File, Response
from starlette.requests import Request

from db.models import Submission
from domain.logic.submission import create_submission, get_last_submission
from domain.models.SubmissionDataclass import SubmissionState
from routes.authentication.role_dependencies import ensure_student_in_group, ensure_user_authorized_for_submission
from routes.tags.swagger_tags import Tags

submission_router = APIRouter()


@submission_router.post("/groups/{group_id}/submission", tags=[Tags.SUBMISSION], summary="Make a submission.")
def make_submission(request: Request, group_id: int, file: Annotated[bytes, File()]) -> Submission:
    session = request.state.session
    student = ensure_student_in_group(request, group_id)

    filename = hashlib.sha256(file).hexdigest()
    with open(f"submissions/{filename}", "wb") as f:
        f.write(file)

    return create_submission(
        session=session,
        student_id=student.id,
        group_id=group_id,
        message="",
        state=SubmissionState.Pending,
        date_time=datetime.datetime.now(),
        filename=filename,
    )


@submission_router.get("/groups/{group_id}/submission", tags=[Tags.SUBMISSION], summary="Get latest submission.")
def retrieve_submission(request: Request, group_id: int) -> Submission:
    session = request.state.session
    ensure_user_authorized_for_submission(request, group_id)
    return get_last_submission(session, group_id)


@submission_router.get("/groups/{group_id}/submission/file", tags=[Tags.SUBMISSION], summary="Get last submission")
def retrieve_submission_file(request: Request, group_id: int) -> Response:
    session = request.state.session
    ensure_user_authorized_for_submission(request, group_id)

    submission = get_last_submission(session, group_id)
    with open(f"submissions/{submission.filename}", "rb") as file:
        content = file.read()
        return Response(content, media_type="application/octet-stream")
