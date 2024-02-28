from abc import ABC, abstractmethod

from db.interface.AbstractDAO import AbstractDAO
from db.models.models import Subject
from domain.models.SubjectDataclass import SubjectDataclass


class SubjectDAO(AbstractDAO[Subject, SubjectDataclass], ABC):
    @staticmethod
    @abstractmethod
    def create_subject(name: str) -> SubjectDataclass:
        """
        Creëert een nieuw SubjectDataclass in de database.

        :param name: De naam van het nieuwe vak.
        :returns: Het nieuw aangemaakte subject.
        """
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def get_subjects_of_teacher(teacher_id: int) -> list[SubjectDataclass]:
        """
        Haalt de subjects op die door een bepaalde teacher worden gegeven.

        :param teacher_id: De teacher waarvan de subjects opgehaald moeten worden.
        :return: Een lijst van subjects die door de gegeven teacher worden gegeven.
        """
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def get_subjects_of_student(student_id: int) -> list[SubjectDataclass]:
        """
        Haalt de subjects op die door een bepaalde student worden gevolgd.

        :param student_id: De student waarvan de subjects opgehaald moeten worden.
        :return: Een lijst van subjects die door de gegeven student worden gegeven.
        """
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def add_student_to_subject(student_id: int, subject_id: int) -> None:
        """
        Voegt een student toe aan een vak.

        :param subject_id: De id van subject die door de student wordt gevolgd.
        :param student_id: De student die subject volgt.
        :raises: ItemNotFoundException: Als er geen student/subject met de opgegeven id in de database is.
        """
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def add_teacher_to_subject(teacher_id: int, subject_id: int) -> None:
        """
        Voegt een teacher toe aan een vak.

        :param subject_id: De id van subject die door de teacher gegeven wordt.
        :param teacher_id: De teacher die dit subject geeft.
        :raises: ItemNotFoundException: Als er geen teacher/subject met de opgegeven id in de database is.
        """
        raise NotImplementedError
