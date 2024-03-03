from abc import abstractmethod
from typing import TYPE_CHECKING

from db.interface.AbstractDAO import AbstractDAO

if TYPE_CHECKING:
    from db.models.models import Student  # noqa: F401
    from domain.models.StudentDataclass import StudentDataclass


class StudentDAO(AbstractDAO["Student", "StudentDataclass"]):
    @abstractmethod
    def create_student(self, name: str, email: str) -> "StudentDataclass":
        """
        Maakt een nieuwe student aan.

        :param name: De naam van de nieuwe student
        :param email: De email van de nieuwe student
        :returns: De nieuw aangemaakte student
        """
        raise NotImplementedError

    @abstractmethod
    def is_user_student(self, user_id: int) -> bool:
        raise NotImplementedError
