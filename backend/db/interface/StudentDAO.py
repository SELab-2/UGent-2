from abc import abstractmethod

from db.interface.AbstractDAO import AbstractDAO
from db.models.models import Student
from domain.models.StudentDataclass import StudentDataclass


class StudentDAO(AbstractDAO[Student, StudentDataclass]):
    @abstractmethod
    def create_student(self, name: str, email: str) -> StudentDataclass:
        """
        Maakt een nieuwe student aan.

        :param name: De naam van de nieuwe student
        :param email: De email van de nieuwe student
        :returns: De nieuw aangemaakte student
        """
        raise NotImplementedError
