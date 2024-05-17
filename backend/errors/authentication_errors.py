from starlette import status

from errors.base_error import ExceptionBase


class InvalidRoleCredentialsError(ExceptionBase):
    detail = "User does not have the required role"
    status_code = status.HTTP_403_FORBIDDEN


class InvalidAdminCredentialsError(ExceptionBase):
    detail = "User does not have the required admin role"
    status_code = status.HTTP_403_FORBIDDEN


class InvalidTeacherCredentialsError(ExceptionBase):
    detail = "User does not have the required teacher role"
    status_code = status.HTTP_403_FORBIDDEN


class InvalidStudentCredentialsError(ExceptionBase):
    detail = "User does not have the required student role"
    status_code = status.HTTP_403_FORBIDDEN


class NoAccessToDataError(ExceptionBase):
    detail = "User does not have access to this data"
    status_code = status.HTTP_403_FORBIDDEN


class InvalidAuthenticationError(ExceptionBase):
    detail = "User is not authenticated"
    status_code = status.HTTP_401_UNAUTHORIZED
