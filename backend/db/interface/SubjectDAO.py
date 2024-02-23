from abc import ABC, abstractmethod

from backend.domain.models.models import Subject


class SubjectDAO(ABC):

    @abstractmethod
    def create_subject(self, subject: Subject, teacher_id: int):
        """
        Creëert een nieuw Subject in de database en associeert het met een Teacher.

        :param subject: De Subject domeinmodel-instantie die aan de database moet worden toegevoegd.
        :param teacher_id: De identificatie van de Teacher waarmee het Subject geassocieerd wordt.
        :raises: ItemNotFoundException: Als er geen Teacher met de opgegeven `teacher_id` in de database bestaat.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_subject(self, teacher_id: int):
        """
        Haalt een Subject op aan de hand van zijn identificatie.

        :param teacher_id: De identificatie van het op te halen Subject.
        :raises ItemNotFoundException: Als er geen Subject met de opgegeven `ident` in de database bestaat.
        :returns: De domeinmodel-instantie van het opgehaalde Subject.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_subjects(self, teacher_id: int) -> list[Subject]:
        """
        Haalt de subjects op die door een bepaalde teacher worden gegeven.

        :param teacher_id: De teacher waarvan de subjects opgehaald moeten worden.
        :return: Een lijst van subjects die door de gegeven teacher worden gegeven.
        """
        raise NotImplementedError()
