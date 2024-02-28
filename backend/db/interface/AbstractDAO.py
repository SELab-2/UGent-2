from abc import ABC, abstractmethod
from typing import Generic, TypeVar

T = TypeVar("T")
D = TypeVar("D")


class AbstractDAO(Generic[T, D], ABC):

    @abstractmethod
    def get_object(self, ident: int) -> D:
        raise NotImplementedError

    @abstractmethod
    def get_all(self) -> list[D]:
        raise NotImplementedError
