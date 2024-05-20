from starlette import status

from errors.base_error import ExceptionBase


class ItemNotFoundError(ExceptionBase):
    """
    The specified item was not found in the database.
    """

    def __init__(self, message: str) -> None:
        self.detail = message
        self.status_code = status.HTTP_404_NOT_FOUND
        super().__init__()


class ActionAlreadyPerformedError(ExceptionBase):
    """
    The specified action was already performed on the database once before
    and may not be performed again as to keep consistency.
    """

    def __init__(self, message: str) -> None:
        self.detail = message
        self.status_code = status.HTTP_400_BAD_REQUEST
        super().__init__()


class NoSuchRelationError(ExceptionBase):
    """
    There is no relation between the two specified elements in the database.
    """

    def __init__(self, message: str) -> None:
        self.detail = message
        self.status_code = status.HTTP_400_BAD_REQUEST
        super().__init__()


class ConflictingRelationError(ExceptionBase):
    """
    There is a conflicting relation
    """

    def __init__(self, message: str) -> None:
        self.detail = message
        self.status_code = status.HTTP_400_BAD_REQUEST
        super().__init__()
