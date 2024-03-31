import datetime
import hashlib
from typing import Annotated

from fastapi import APIRouter, Depends, File, Response
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.submission import create_submission, get_last_submission
from domain.models.StudentDataclass import StudentDataclass
from domain.models.SubmissionDataclass import SubmissionDataclass, SubmissionState
from routes.dependencies.role_dependencies import ensure_student_in_group, ensure_user_authorized_for_submission
from routes.tags.swagger_tags import Tags

submission_router = APIRouter()


@submission_router.post(
    "/groups/{group_id}/submission",
    tags=[Tags.SUBMISSION],
    summary="Make a submission.",
)
def make_submission(
    group_id: int,
    file: Annotated[bytes, File()],
    session: Session = Depends(get_session),
    student: StudentDataclass = Depends(ensure_student_in_group),
) -> SubmissionDataclass:
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


@submission_router.get(
    "/groups/{group_id}/submission",
    tags=[Tags.SUBMISSION],
    summary="Show the latest submission.",
    dependencies=[Depends(ensure_user_authorized_for_submission)],
)
def retrieve_submission(
    group_id: int,
    session: Session = Depends(get_session),
) -> SubmissionDataclass:
    return get_last_submission(session, group_id)


@submission_router.get(
    "/groups/{group_id}/submission/file",
    tags=[Tags.SUBMISSION],
    summary="Retrieve the latest submission file.",
    dependencies=[Depends(ensure_user_authorized_for_submission)],
)
def retrieve_submission_file(
    group_id: int,
    session: Session = Depends(get_session),
) -> Response:
    submission = get_last_submission(session, group_id)
    with open(f"submissions/{submission.filename}", "rb") as file:
        content = file.read()
        return Response(content, media_type="application/octet-stream")
