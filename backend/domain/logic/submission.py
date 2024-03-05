from datetime import datetime
from typing import Type

from sqlalchemy.orm import Session

from db.models.models import Student, Group, Submission
from domain.logic.basic_operations import get
from domain.models.SubmissionDataclass import SubmissionDataclass, SubmissionState


def create_submission(
        session: Session,
        student_id: int,
        group_id: int,
        message: str,
        state: SubmissionState,
        date_time: datetime
) -> SubmissionDataclass:
    student: Student = get(session, Type[Student], ident=student_id)
    group: Group = get(session, Type[Group], ident=group_id)

    new_submission: Submission = Submission(
        student_id=student.id,
        group_id=group.id,
        message=message,
        state=state,
        date_time=date_time
    )
    session.add(new_submission)
    session.commit()
    return new_submission.to_domain_model()


def get_submissions_of_student(session: Session, student_id: int) -> list[SubmissionDataclass]:
    student: Student = get(session, Type[Student], ident=student_id)
    submissions: list[Submission] = student.submissions
    return [submission.to_domain_model() for submission in submissions]


def get_submissions_of_group(session: Session, group_id: int) -> list[SubmissionDataclass]:
    group: Group = get(session, Type[Group], ident=group_id)
    submissions: list[Submission] = group.submissions
    return [submission.to_domain_model() for submission in submissions]
