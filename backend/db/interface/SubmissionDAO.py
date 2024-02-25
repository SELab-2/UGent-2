from abc import ABC, abstractmethod

from domain.models.models import SubmissionDataclass


class SubmissionDAO(ABC):
    @abstractmethod
    def create_submission(self, submission: SubmissionDataclass, student_id: int, group_id: int):
        """
        Creëert een nieuw SubmissionDataClass in de database en associeert het met een StudentDataclass en een
        GroupDataClass.

        :param submission: De SubmissionDataClass domeinmodel-instantie die aan de database moet worden toegevoegd.
        :param student_id: De identificatie van de StudentDataclass waarmee het SubmissionDataClass geassocieerd wordt.
        :param group_id: De identificatie van de GroupDataClass waarmee het SubmissionDataClass geassocieerd wordt
        :raises: ItemNotFoundException: Als er geen StudentDataclass of GroupDataClass met de opgegeven `student_id` of
        `group_id` in de database is.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_submission(self, submission_id: int) -> SubmissionDataclass:
        """
        Haalt een SubmissionDataClass op aan de hand van zijn identificatie.

        :param submission_id: De identificatie van het op te halen SubmissionDataClass.
        :raises ItemNotFoundException: Als er geen SubmissionDataclass met de opgegeven `project_id` in de database
        bestaat.
        :returns: De domeinmodel-instantie van het opgehaalde SubmissionDataClass.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_submissions_student(self, student_id: int) -> list[SubmissionDataclass]:
        """
        Haalt alle projecten op die bij een bepaalde student horen.

        :param student_id: De student waarvan de submissions opgehaald moeten worden.
        :return: Een lijst van submissions die bij een bepaalde student horen.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_submissions_group(self, group_id: int) -> list[SubmissionDataclass]:
        """
        Haalt alle projecten op die bij een bepaalde groep horen.

        :param group_id: De groep waarvan de submissions opgehaald moeten worden.
        :return: Een lijst van submissions die bij een bepaalde groep horen.
        """
        raise NotImplementedError()
