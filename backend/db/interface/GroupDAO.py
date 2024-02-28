from abc import ABC, abstractmethod

from domain.models.GroupDataclass import GroupDataclass
from domain.models.StudentDataclass import StudentDataclass


class GroupDAO(ABC):
    @staticmethod
    @abstractmethod
    def create_group(project_id: int) -> GroupDataclass:
        """
        Creëert een nieuw GroupDataClass in de database en associeert het met een ProjectDataClass.

        :param project_id: Id van het project dat gelinkt is aan de groep
        :raises: ItemNotFoundException: Als er geen ProjectDataClass met de opgegeven `project_id` in de database is.
        :returns: De nieuw aangemaakte groep
        """
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def get_groups_of_project(project_id: int) -> list[GroupDataclass]:
        """
        Haalt alle groepen op die bij een bepaald project horen.

        :param project_id: Het subject waarvan de projecten opgehaald moeten worden.
        :return: Een lijst van projecten die bij een bepaald project horen.
        """
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def get_groups_of_student(student_id: int) -> list[GroupDataclass]:
        """
        Haalt alle groepen op die bij een bepaalde student horen.

        :param student_id: De student waarvan de groepen opgehaald moeten worden.
        :return: Een lijst van groepen die bij een bepaald student horen.
        """
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def add_student_to_group(student_id: int, group_id: int) -> None:
        """
        Gaat een student toevoegen aan een groep

        :param student_id: De student die aan de groep moet toegevoegd worden.
        :param group_id: De groep waaraan de student moet toegevoegd worden.
        :raises ItemNotFoundException: Als er geen group/student met gegeven id in de databank zit.
        """
        raise NotImplementedError

    @staticmethod
    def get_students_of_group(group_id: int) -> list[StudentDataclass]:
        """
        Gaat alle studenten geven die in een bepaalde groep zitten

        :param group_id: De groep waarvan de studenten worden opgeroepen
        :raises ItemNotFoundException: Als er geen group met gegeven id in de databank zit.
        """
        raise NotImplementedError
