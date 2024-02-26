from abc import ABC, abstractmethod

from domain.models.SubjectDataclass import SubjectDataclass


class SubjectDAO(ABC):
    @abstractmethod
    def create_subject(self, name: str) -> None:
        """
        Creëert een nieuw SubjectDataclass in de database.

        :param name: De naam van het nieuwe vak.
        """
        raise NotImplementedError

    @abstractmethod
    def get_subject(self, subject_id: int) -> SubjectDataclass:
        """
        Haalt een SubjectDataclass op aan de hand van zijn identificatie.

        :param subject_id: De identificatie van het op te halen SubjectDataclass.
        :raises ItemNotFoundException: Als er geen SubjectDataclass met de opgegeven `ident` in de database bestaat.
        :returns: De domeinmodel-instantie van het opgehaalde SubjectDataclass.
        """
        raise NotImplementedError

    @abstractmethod
    def get_subjects_of_teacher(self, teacher_id: int) -> list[SubjectDataclass]:
        """
        Haalt de subjects op die door een bepaalde teacher worden gegeven.

        :param teacher_id: De teacher waarvan de subjects opgehaald moeten worden.
        :return: Een lijst van subjects die door de gegeven teacher worden gegeven.
        """
        raise NotImplementedError

    @abstractmethod
    def get_subjects_of_student(self, student_id: int) -> list[SubjectDataclass]:
        """
        Haalt de subjects op die door een bepaalde student worden gevolgd.

        :param student_id: De student waarvan de subjects opgehaald moeten worden.
        :return: Een lijst van subjects die door de gegeven student worden gegeven.
        """
        raise NotImplementedError

    @abstractmethod
    def add_student_to_subject(self, student_id: int, subject_id: int) -> None:
        """
        Voegt een student toe aan een vak.

        :param subject_id: De id van subject die door de student wordt gevolgd.
        :param student_id: De student die subject volgt.
        :raises: ItemNotFoundException: Als er geen student/subject met de opgegeven id in de database is.
        """
        raise NotImplementedError

    @abstractmethod
    def add_teacher_to_subject(self, teacher_id: int, subject_id: int) -> None:
        """
        Voegt een teacher toe aan een vak.

        :param subject_id: De id van subject die door de teacher gegeven wordt.
        :param teacher_id: De teacher die dit subject geeft.
        :raises: ItemNotFoundException: Als er geen teacher/subject met de opgegeven id in de database is.
        """
        raise NotImplementedError
