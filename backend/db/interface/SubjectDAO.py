from abc import ABC, abstractmethod

from domain.models.SubjectDataclass import SubjectDataclass


class SubjectDAO(ABC):
    @abstractmethod
    def create_subject(self, subject: SubjectDataclass, teacher_id: int):
        """
        Creëert een nieuw SubjectDataclass in de database en associeert het met een TeacherDataclass.

        :param subject: De SubjectDataclass domeinmodel-instantie die aan de database moet worden toegevoegd.
        :param teacher_id: De identificatie van de TeacherDataclass waarmee het SubjectDataclass geassocieerd wordt.
        :raises: ItemNotFoundException: Als er geen TeacherDataclass met de opgegeven `teacher_id` in de database is.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_subject(self, teacher_id: int):
        """
        Haalt een SubjectDataclass op aan de hand van zijn identificatie.

        :param teacher_id: De identificatie van het op te halen SubjectDataclass.
        :raises ItemNotFoundException: Als er geen SubjectDataclass met de opgegeven `ident` in de database bestaat.
        :returns: De domeinmodel-instantie van het opgehaalde SubjectDataclass.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_subjects(self, teacher_id: int) -> list[SubjectDataclass]:
        """
        Haalt de subjects op die door een bepaalde teacher worden gegeven.

        :param teacher_id: De teacher waarvan de subjects opgehaald moeten worden.
        :return: Een lijst van subjects die door de gegeven teacher worden gegeven.
        """
        raise NotImplementedError()
