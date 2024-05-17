from starlette import status

from domain.simple_submission_checks.constraints.constraint_result import ConstraintResult
from errors.base_error import ExceptionBase


class InvalidConstraintsError(ExceptionBase):
    detail = "The constraints are invalid"
    status_code = status.HTTP_400_BAD_REQUEST


class InvalidSubmissionError(ExceptionBase):
    detail = "Invalid submission content"
    status_code = status.HTTP_400_BAD_REQUEST

    def __init__(self, constraint_result: ConstraintResult) -> None:
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = constraint_result.model_dump_json()


class UserNotEnrolledError(ExceptionBase):
    detail = "User is not enrolled for this course"
    status_code = status.HTTP_400_BAD_REQUEST


class ArchivedError(ExceptionBase):
    detail = "Can't modify archived data"
    status_code = status.HTTP_400_BAD_REQUEST


class NotATeacherError(ExceptionBase):
    detail = "User isn't a teacher"
    status_code = status.HTTP_400_BAD_REQUEST
