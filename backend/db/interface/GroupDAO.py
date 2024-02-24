from abc import ABC, abstractmethod

from domain.models.models import GroupDataclass


class Group(ABC):

    @abstractmethod
    def create_group(self, group: GroupDataclass, project_id: int):
        """
        Creëert een nieuw GroupDataClass in de database en associeert het met een ProjectDataClass.

        :param group: De GroupDataClass domeinmodel-instantie die aan de database moet worden toegevoegd.
        :param project_id: De identificatie van de ProjectDataClass waarmee het GroupDataClass geassocieerd wordt.
        :raises: ItemNotFoundException: Als er geen ProjectDataClass met de opgegeven `project_id` in de database is.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_group(self, group_id: int) -> GroupDataclass:
        """
        Haalt een GroupDataClass op aan de hand van zijn identificatie.

        :param group_id: De identificatie van het op te halen GroupDataClass.
        :raises ItemNotFoundException: Als er geen GroupDataClass met de opgegeven `group_id` in de database bestaat.
        :returns: De domeinmodel-instantie van het opgehaalde GroupDataClass.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_groups_project(self, project_id: int) -> list[GroupDataclass]:
        """
        Haalt alle groepen op die bij een bepaald project horen.

        :param project_id: Het subject waarvan de projecten opgehaald moeten worden.
        :return: Een lijst van projecten die bij een bepaald project horen.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_groups_student(self, student_id: int) -> list[GroupDataclass]:
        """
        Haalt alle groepen op die bij een bepaalde student horen.

        :param student_id: De student waarvan de groepen opgehaald moeten worden.
        :return: Een lijst van groepen die bij een bepaald student horen.
        """
        raise NotImplementedError()
