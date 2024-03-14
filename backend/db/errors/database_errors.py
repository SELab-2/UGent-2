class ItemNotFoundError(Exception):
    """
    The specified item was not found in the database.
    """
    def __init__(self, message: str) -> None:
        super().__init__(message)


class ActionAlreadyPerformedError(Exception):
    """
    The specified action was already performed on the database once before 
    and may not be performed again as to keep consistency.
    """
    def __init__(self, message: str) -> None:
        super().__init__(message)


class NoSuchRelationError(Exception):
    """
    There is no relation between the two specified elements in the database.
    """
    def __init__(self, message: str) -> None:
        super().__init__(message)
