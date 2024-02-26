from abc import ABC, abstractmethod

from domain.models.GroupDataclass import GroupDataclass
from domain.models.StudentDataclass import StudentDataclass


class GroupDAO(ABC):
    @abstractmethod
    def create_group(self, project_id: int) -> None:
        """
        Creëert een nieuw GroupDataClass in de database en associeert het met een ProjectDataClass.

        :param project_id: Id van het project dat gelinkt is aan de groep
        :raises: ItemNotFoundException: Als er geen ProjectDataClass met de opgegeven `project_id` in de database is.
        """
        raise NotImplementedError

    @abstractmethod
    def get_group(self, group_id: int) -> GroupDataclass:
        """
        Haalt een GroupDataClass op aan de hand van zijn identificatie.

        :param group_id: De identificatie van het op te halen GroupDataClass.
        :raises ItemNotFoundException: Als er geen GroupDataClass met de opgegeven `group_id` in de database bestaat.
        :returns: De domeinmodel-instantie van het opgehaalde GroupDataClass.
        """
        raise NotImplementedError

    @abstractmethod
    def get_groups_of_project(self, project_id: int) -> list[GroupDataclass]:
        """
        Haalt alle groepen op die bij een bepaald project horen.

        :param project_id: Het subject waarvan de projecten opgehaald moeten worden.
        :return: Een lijst van projecten die bij een bepaald project horen.
        """
        raise NotImplementedError

    @abstractmethod
    def get_groups_of_student(self, student_id: int) -> list[GroupDataclass]:
        """
        Haalt alle groepen op die bij een bepaalde student horen.

        :param student_id: De student waarvan de groepen opgehaald moeten worden.
        :return: Een lijst van groepen die bij een bepaald student horen.
        """
        raise NotImplementedError

    @abstractmethod
    def add_student_to_group(self, student_id: int, group_id: int) -> None:
        """
        Gaat een student toevoegen aan een groep

        :param student_id: De student die aan de groep moet toegevoegd worden.
        :param group_id: De groep waaraan de student moet toegevoegd worden.
        :raises ItemNotFoundException: Als er geen group/student met gegeven id in de databank zit.
        """
        raise NotImplementedError

    def get_students_of_group(self, group_id: int) -> list[StudentDataclass]:
        """
        Gaat alle studenten geven die in een bepaalde groep zitten

        :param group_id: De groep waarvan de studenten worden opgeroepen
        :raises ItemNotFoundException: Als er geen group met gegeven id in de databank zit.
        """
        raise NotImplementedError
