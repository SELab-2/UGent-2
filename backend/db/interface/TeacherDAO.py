from abc import abstractmethod

from db.interface.AbstractDAO import AbstractDAO
from db.models.models import Teacher
from domain.models.TeacherDataclass import TeacherDataclass


class TeacherDAO(AbstractDAO[Teacher, TeacherDataclass]):
    @abstractmethod
    def create_teacher(self, name: str, email: str) -> TeacherDataclass:
        """
        Maakt een nieuwe teacher aan.

        :param name: De naam van de nieuwe teacher.
        :param email: De email van de nieuwe teacher.
        :returns: De nieuw aangemaakte teacher.
        """
        raise NotImplementedError
