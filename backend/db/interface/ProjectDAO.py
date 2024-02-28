from abc import abstractmethod
from datetime import datetime

from db.interface.AbstractDAO import AbstractDAO
from db.models.models import Project
from domain.models.ProjectDataclass import ProjectDataclass


class ProjectDAO(AbstractDAO[Project, ProjectDataclass]):

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
    def get_projects_of_subject(self, subject_id: int) -> list[ProjectDataclass]:
        """
        Haalt alle projecten op die bij een bepaald subject horen.

        :param subject_id: Het subject waarvan de projecten opgehaald moeten worden.
        :return: Een lijst van projecten die bij een bepaald subject horen.
        """
        raise NotImplementedError
