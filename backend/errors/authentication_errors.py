from starlette import status

from errors.base_error import ExceptionBase


class InvalidRoleCredentialsError(ExceptionBase):
    ERROR_MESSAGE = "User does not have the required role"
    STATUS_CODE = status.HTTP_403_FORBIDDEN


class InvalidAdminCredentialsError(ExceptionBase):
    ERROR_MESSAGE = "User does not have the required admin role"
    STATUS_CODE = status.HTTP_403_FORBIDDEN


class InvalidTeacherCredentialsError(ExceptionBase):
    ERROR_MESSAGE = "User does not have the required teacher role"
    STATUS_CODE = status.HTTP_403_FORBIDDEN


class InvalidStudentCredentialsError(ExceptionBase):
    ERROR_MESSAGE = "User does not have the required student role"
    STATUS_CODE = status.HTTP_403_FORBIDDEN


class NoAccessToDataError(ExceptionBase):
    ERROR_MESSAGE = "User does not have access to this data"
    STATUS_CODE = status.HTTP_403_FORBIDDEN


class InvalidAuthenticationError(ExceptionBase):
    ERROR_MESSAGE = "User is not authenticated"
    STATUS_CODE = status.HTTP_401_UNAUTHORIZED
