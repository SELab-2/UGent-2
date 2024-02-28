from datetime import datetime

from sqlalchemy.orm import Session

from db.errors.database_errors import ItemNotFoundError
from db.extensions import engine
from db.implementation.SqlAbstractDAO import SqlAbstractDAO
from db.interface.SubmissionDAO import SubmissionDAO
from db.models.models import Group, Student, Submission
from domain.models.SubmissionDataclass import SubmissionDataclass, SubmissionState


class SqlSubmissionDAO(SubmissionDAO, SqlAbstractDAO[Submission, SubmissionDataclass]):
    @staticmethod
    def create_submission(student_id: int, group_id: int, message: str, state: SubmissionState,
                          date_time: datetime) -> SubmissionDataclass:
        with Session(engine) as session:
            student: Student | None = session.get(Student, ident=student_id)
            group: Group | None = session.get(Group, ident=group_id)
            if not student:
                msg = f"Student with id {student_id} not found"
                raise ItemNotFoundError(msg)
            if not group:
                msg = f"Group with id {group_id} not found"
                raise ItemNotFoundError(msg)
            new_submission: Submission = Submission(student_id=student_id,
                                                    group_id=group_id, message=message, state=state,
                                                    date_time=date_time)
            session.add(new_submission)
            session.commit()
            return new_submission.to_domain_model()

    @staticmethod
    def get_submissions_of_student(student_id: int) -> list[SubmissionDataclass]:
        with Session(engine) as session:
            student: Student | None = session.get(Student, ident=student_id)
            if not student:
                msg = f"Student with id {student_id} not found"
                raise ItemNotFoundError(msg)
            submissions: list[Submission] = student.submissions
            return [submission.to_domain_model() for submission in submissions]

    @staticmethod
    def get_submissions_of_group(group_id: int) -> list[SubmissionDataclass]:
        with Session(engine) as session:
            group: Group | None = session.get(Group, ident=group_id)
            if not group:
                msg = f"Group with id {group_id} not found"
                raise ItemNotFoundError(msg)
            submissions: list[Submission] = group.submissions
            return [submission.to_domain_model() for submission in submissions]
