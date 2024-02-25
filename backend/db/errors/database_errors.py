class ItemNotFoundError(Exception):
    def __init__(self, message: str):
        super().__init__(message)


class UniqueConstraintError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
