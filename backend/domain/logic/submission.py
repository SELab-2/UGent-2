from datetime import datetime

from sqlmodel import Session

from db.models import Group, Student, Submission
from domain.logic.basic_operations import get, get_all
from domain.models.SubmissionDataclass import SubmissionState


def create_submission(
    session: Session,
    student_id: int,
    group_id: int,
    message: str,
    state: SubmissionState,
    date_time: datetime,
    filename: str,
) -> Submission:
    """
    Create a submission for a certain project by a certain group.
    """
    student: Student = get(session, Student, ident=student_id)
    group: Group = get(session, Group, ident=group_id)

    new_submission: Submission = Submission(
        student_id=student.id,
        group_id=group.id,
        message=message,
        state=state,
        date_time=date_time,
        filename=filename,
    )
    session.add(new_submission)
    session.commit()
    return new_submission


def get_submission(session: Session, submission_id: int) -> Submission:
    return get(session, Submission, submission_id)


def get_all_submissions(session: Session) -> list[Submission]:
    return get_all(session, Submission)


def get_submissions_of_student(session: Session, student_id: int) -> list[Submission]:
    student: Student = get(session, Student, ident=student_id)
    return student.submissions


def get_submissions_of_group(session: Session, group_id: int) -> list[Submission]:
    group: Group = get(session, Group, ident=group_id)
    return group.submissions


def get_last_submission(session: Session, group_id: int) -> Submission:
    submissions = get_submissions_of_group(session, group_id)
    return max(submissions, key=lambda submission: submission.date_time)
