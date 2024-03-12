class InvalidRoleCredentialsError(Exception):
    ERROR_MESSAGE = "User does not have the required role"


class InvalidAdminCredentialsError(InvalidRoleCredentialsError):
    ERROR_MESSAGE = "User does not have the required admin role"


class InvalidTeacherCredentialsError(InvalidRoleCredentialsError):
    ERROR_MESSAGE = "User does not have the required teacher role"


class InvalidStudentCredentialsError(InvalidRoleCredentialsError):
    ERROR_MESSAGE = "User does not have the required student role"


class NoAccessToSubjectError(Exception):
    ERROR_MESSAGE = "User doesn't have access to subject"
