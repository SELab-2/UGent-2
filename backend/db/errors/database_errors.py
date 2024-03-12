class ItemNotFoundError(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)


class ActionAlreadyPerformedError(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)


class NoSuchRelationError(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)
