from abc import ABC, abstractmethod

from domain.models.models import ProjectDataclass


class ProjectDAO(ABC):
    @abstractmethod
    def create_project(self, project: ProjectDataclass, subject_id: int):
        """
        Creëert een nieuw ProjectDataClass in de database en associeert het met een SubjectDataClass.

        :param project: De ProjectDataClass domeinmodel-instantie die aan de database moet worden toegevoegd.
        :param subject_id: De identificatie van de SubjectDataClass waarmee het ProjectDataClass geassocieerd wordt.
        :raises: ItemNotFoundException: Als er geen SubjectDataClass met de opgegeven `teacher_id` in de database is.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_project(self, project_id: int) -> ProjectDataclass:
        """
        Haalt een ProjectDataClass op aan de hand van zijn identificatie.

        :param project_id: De identificatie van het op te halen ProjectDataClass.
        :raises ItemNotFoundException: Als er geen ProjectDataClass met de opgegeven `project_id` in de database bestaat
        :returns: De domeinmodel-instantie van het opgehaalde ProjectDataClass.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_projects(self, subject_id: int) -> list[ProjectDataclass]:
        """
        Haalt alle projecten op die bij een bepaald subject horen.

        :param subject_id: Het subject waarvan de projecten opgehaald moeten worden.
        :return: Een lijst van projecten die bij een bepaald subject horen.
        """
        raise NotImplementedError()
