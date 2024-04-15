class InvalidConstraintsError(Exception):
    ERROR_MESSAGE = "The constraints are invalid"


class InvalidSubmissionError(Exception):
    ERROR_MESSAGE = "Invalid submission content"


class UserNotEnrolledError(Exception):
    ERROR_MESSAGE = "User is not enrolled for this subject"


class ArchivedError(Exception):
    ERROR_MESSAGE = "Can't modify archived data"
