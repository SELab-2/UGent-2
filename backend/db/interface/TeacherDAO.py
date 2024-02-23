from abc import ABC, abstractmethod

from backend.domain.models.models import Teacher


class TeacherDAO(ABC):

    @abstractmethod
    def get_teacher(self, ident: int) -> Teacher:
        """
        Haalt een teacher op aan de hand van zijn identificatie.

        :param ident: Het id van de te zoeken teacher.
        :return: De teacher die overeenkomt met de gegeven id.
        :raises ItemNotFoundException: Als geen teacher met het gegeven id gevonden werd.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_all_teachers(self) -> list[Teacher]:
        """
        Haalt alle lesgevers op.

        :return: Een lijst van alle lesgevers.
        """
        raise NotImplementedError()

    @abstractmethod
    def create_teacher(self, teacher: Teacher):
        """
        Maakt een nieuwe teacher aan.

        :param teacher: De teacher die aangemaakt moet worden.
        """
        raise NotImplementedError()
