from typing import List

from db.errors.database_errors import ItemNotFoundError, UniqueConstraintError
from db.extensions import db
from db.interface.SubmissionDAO import SubmissionDAO
from db.models.models import Student, Subject, Teacher, Project, Group, Submission
from domain.models.models import SubjectDataclass, SubmissionDataclass


class SqlSubmissionDAO(SubmissionDAO):
    def create_submission(self, submission: SubmissionDataclass, student_id: int, group_id: int):
        student = Student.query.get(student_id)
        group = Group.query.get(group_id)
        if not student:
            raise ItemNotFoundError(f"student met id {student_id} kon niet in de databank gevonden worden")
        if not group:
            raise ItemNotFoundError(f"group met id {group_id} kon niet in de databank gevonden worden")
        new_submission: Submission = Submission()
        new_submission.group_id = group_id
        new_submission.group = group
        new_submission.student_id = student_id
        new_submission.student = student
        new_submission.date_time = submission.date_time
        new_submission.state = submission.state
        new_submission.message = submission.message

        db.session.add(new_submission)
        db.session.commit()

    def get_submission(self, submission_id: int) -> SubmissionDataclass:
        submission = Submission.query.get(submission_id)
        if not submission:
            raise ItemNotFoundError(f"submission met id {submission_id} kon niet in de databank gevonden worden")
        return submission

    def get_submissions_student(self, student_id: int) -> list[SubmissionDataclass]:
        student = Student.query.get(student_id)
        if not student:
            raise ItemNotFoundError(f"student met id {student_id} kon niet in de databank gevonden worden")
        submissions: list[SubmissionDataclass] = student.submissions
        return submissions

    def get_submissions_group(self, group_id: int) -> list[SubmissionDataclass]:
        group = Group.query.get(group_id)
        if not group:
            raise ItemNotFoundError(f"group met id {group_id} kon niet in de databank gevonden worden")
        submissions: list[SubmissionDataclass] = group.submissions
        return submissions
