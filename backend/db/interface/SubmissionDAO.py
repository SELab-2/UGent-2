from abc import ABC, abstractmethod
from datetime import datetime

from db.interface.AbstractDAO import AbstractDAO
from db.models.models import Submission
from domain.models.SubmissionDataclass import SubmissionDataclass, SubmissionState


class SubmissionDAO(AbstractDAO[Submission, SubmissionDataclass], ABC):
    @staticmethod
    @abstractmethod
    def create_submission(student_id: int, group_id: int, message: str,
                          state: SubmissionState, date_time: datetime) -> SubmissionDataclass:
        """
        Creëert een nieuw SubmissionDataClass in de database en associeert het met een StudentDataclass en een
        GroupDataClass.

        :param student_id: De identificatie van de StudentDataclass waarmee het SubmissionDataClass geassocieerd wordt.
        :param group_id: De identificatie van de GroupDataClass waarmee het SubmissionDataClass geassocieerd wordt
        :raises: ItemNotFoundException: Als er geen StudentDataclass of GroupDataClass met de opgegeven `student_id` of
        `group_id` in de database is.
        :return: De nieuw aangemaakte submission
        """
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def get_submissions_of_student(student_id: int) -> list[SubmissionDataclass]:
        """
        Haalt alle projecten op die bij een bepaalde student horen.

        :param student_id: De student waarvan de submissions opgehaald moeten worden.
        :return: Een lijst van submissions die bij een bepaalde student horen.
        """
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def get_submissions_of_group(group_id: int) -> list[SubmissionDataclass]:
        """
        Haalt alle projecten op die bij een bepaalde groep horen.

        :param group_id: De groep waarvan de submissions opgehaald moeten worden.
        :return: Een lijst van submissions die bij een bepaalde groep horen.
        """
        raise NotImplementedError
