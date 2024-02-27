from abc import ABC, abstractmethod
from datetime import datetime

from domain.models.ProjectDataclass import ProjectDataclass


class ProjectDAO(ABC):
    @abstractmethod
    def create_project(self, subject_id: int, name: str, deadline: datetime, archived: bool, requirements: str,
                       visible: bool, max_students: int) -> ProjectDataclass:
        """
        Creëert een nieuw ProjectDataClass in de database en associeert het met een SubjectDataClass.

        :param max_students: maximaal aantal studenten per groep per project
        :param visible: of het project zichtbaar is voor de studenten
        :param requirements: Uitleg van het project
        :param archived: Of het project gearchiveerd is
        :param name: De naam van het project
        :param deadline: De deadline van het project
        :param subject_id: De identificatie van de SubjectDataClass waarmee het ProjectDataClass geassocieerd wordt.
        :raises: ItemNotFoundException: Als er geen SubjectDataClass met de opgegeven `teacher_id` in de database is.
        :returns: Het nieuw aangemaakte project
        """
        raise NotImplementedError

    @abstractmethod
    def get_project(self, project_id: int) -> ProjectDataclass:
        """
        Haalt een ProjectDataClass op aan de hand van zijn identificatie.

        :param project_id: De identificatie van het op te halen ProjectDataClass.
        :raises ItemNotFoundException: Als er geen ProjectDataClass met de opgegeven `project_id` in de database bestaat
        :returns: De domeinmodel-instantie van het opgehaalde ProjectDataClass.
        """
        raise NotImplementedError

    @abstractmethod
    def get_projects_of_subject(self, subject_id: int) -> list[ProjectDataclass]:
        """
        Haalt alle projecten op die bij een bepaald subject horen.

        :param subject_id: Het subject waarvan de projecten opgehaald moeten worden.
        :return: Een lijst van projecten die bij een bepaald subject horen.
        """
        raise NotImplementedError
