from abc import ABC, abstractmethod
from typing import Generic, TypeVar

from db.models.models import AbstractModel

T = TypeVar("T")
D = TypeVar("D")


class AbstractDAO(Generic[T, D], ABC):

    @staticmethod
    @abstractmethod
    def get_object(ident: int) -> D:
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def get_all() -> list[D]:
        raise NotImplementedError
