import datetime

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.submission import create_submission
from domain.models.StudentDataclass import StudentDataclass
from domain.models.SubmissionDataclass import SubmissionDataclass, SubmissionState
from routes.dependencies.role_dependencies import ensure_student_in_group
from routes.tags.swagger_tags import Tags

submission_router = APIRouter()


@submission_router.post(
    "/groups/{group_id}/submit",
    tags=[Tags.SUBMISSION],
    summary="Make a submission.",
)
def make_submission(
    group_id: int,
    file: UploadFile,
    session: Session = Depends(get_session),
    student: StudentDataclass = Depends(ensure_student_in_group),
) -> SubmissionDataclass:
    return create_submission(
        session=session,
        student_id=student.id,
        group_id=group_id,
        message="",
        state=SubmissionState.Pending,
        date_time=datetime.datetime.now(),
    )
