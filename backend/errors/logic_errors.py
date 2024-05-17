from starlette import status

from errors.base_error import ExceptionBase


class InvalidConstraintsError(ExceptionBase):
    ERROR_MESSAGE = "The constraints are invalid"
    STATUS_CODE = status.HTTP_400_BAD_REQUEST


class InvalidSubmissionError(ExceptionBase):
    ERROR_MESSAGE = "Invalid submission content"
    STATUS_CODE = status.HTTP_400_BAD_REQUEST


class UserNotEnrolledError(ExceptionBase):
    ERROR_MESSAGE = "User is not enrolled for this course"
    STATUS_CODE = status.HTTP_400_BAD_REQUEST


class ArchivedError(ExceptionBase):
    ERROR_MESSAGE = "Can't modify archived data"
    STATUS_CODE = status.HTTP_400_BAD_REQUEST


class NotATeacherError(ExceptionBase):
    ERROR_MESSAGE = "User isn't a teacher"
    STATUS_CODE = status.HTTP_400_BAD_REQUEST
