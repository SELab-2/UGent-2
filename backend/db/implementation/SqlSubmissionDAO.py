from datetime import datetime

from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.SubmissionDAO import SubmissionDAO
from db.models.models import Group, Student, Submission
from domain.models.SubmissionDataclass import SubmissionDataclass, SubmissionState


class SqlSubmissionDAO(SubmissionDAO):
    def create_submission(self, student_id: int, group_id: int, message: str,state: SubmissionState,
                          date_time: datetime) -> SubmissionDataclass:

        student: Student | None = db.session.get(Student, ident=student_id)
        group: Group | None = db.session.get(Group, ident=group_id)
        if not student:
            msg = f"Student with id {student_id} not found"
            raise ItemNotFoundError(msg)
        if not group:
            msg = f"Group with id {group_id} not found"
            raise ItemNotFoundError(msg)
        new_submission: Submission = Submission(student_id=student_id,
                                                group_id=group_id, message=message, state=state, date_time=date_time)
        db.session.add(new_submission)
        db.session.commit()
        return new_submission.to_domain_model()

    def get_submission(self, submission_id: int) -> SubmissionDataclass:
        submission: Submission | None = db.session.get(Submission, ident=submission_id)
        if not submission:
            msg = f"Submission with id {submission_id} not found"
            raise ItemNotFoundError(msg)
        return submission.to_domain_model()

    def get_submissions_of_student(self, student_id: int) -> list[SubmissionDataclass]:
        student: Student | None = db.session.get(Student, ident=student_id)
        if not student:
            msg = f"Student with id {student_id} not found"
            raise ItemNotFoundError(msg)
        submissions: list[Submission] = student.submissions
        return [submission.to_domain_model() for submission in submissions]

    def get_submissions_of_group(self, group_id: int) -> list[SubmissionDataclass]:
        group: Group | None = db.session.get(Group, ident=group_id)
        if not group:
            msg = f"Group with id {group_id} not found"
            raise ItemNotFoundError(msg)
        submissions: list[Submission] = group.submissions
        return [submission.to_domain_model() for submission in submissions]
