from abc import ABC, abstractmethod


class ValidationResult(ABC):

    def __init__(self) -> None:
        self.errors = []

    @abstractmethod
    def __bool__(self) -> bool:
        raise NotImplementedError


class ValidationSuccess(ValidationResult):

    def __bool__(self) -> bool:
        return True


class ValidationError(ValidationResult):
    def add_error(self, error: str) -> None:
        self.errors.append(error)

    def __bool__(self) -> bool:
        return False
