from abc import ABC, abstractmethod


class ValidationResult(ABC):

    errors: list[str]

    @abstractmethod
    def __bool__(self) -> bool:
        raise NotImplementedError


class ValidationSuccess(ValidationResult):

    def __bool__(self) -> bool:
        return True


class ValidationError(ValidationResult):
    def __init__(self, errors: list[str]) -> None:
        self.errors = errors

    def __bool__(self) -> bool:
        return False
