from abc import abstractmethod
from typing import TYPE_CHECKING

from db.interface.AbstractDAO import AbstractDAO

if TYPE_CHECKING:
    from domain.models.TeacherDataclass import TeacherDataclass


class TeacherDAO(AbstractDAO):
    @abstractmethod
    def create_teacher(self, name: str, email: str) -> "TeacherDataclass":
        """
        Maakt een nieuwe teacher aan.

        :param name: De naam van de nieuwe teacher.
        :param email: De email van de nieuwe teacher.
        :returns: De nieuw aangemaakte teacher.
        """
        raise NotImplementedError

    @abstractmethod
    def is_user_teacher(self, user_id: int) -> bool:
        raise NotImplementedError
