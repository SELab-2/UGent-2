from abc import ABC, abstractmethod

from domain.models.StudentDataclass import StudentDataclass


class StudentDAO(ABC):
    @abstractmethod
    def get_student(self, ident: int) -> StudentDataclass:
        """
        Haalt een student op aan de hand van zijn identificatie.

        :param ident: Het id van de te zoeken student.
        :return: De student die overeenkomt met de gegeven id.
        :raises ItemNotFoundException: Als geen student met het gegeven id gevonden werd.
        """
        raise NotImplementedError

    @abstractmethod
    def get_all_students(self) -> list[StudentDataclass]:
        """
        Haalt alle studenten op.

        :return: Een lijst van alle studenten.
        """
        raise NotImplementedError

    @abstractmethod
    def create_student(self, name: str, email: str) -> StudentDataclass:
        """
        Maakt een nieuwe student aan.

        :param name: De naam van de nieuwe student
        :param email: De email van de nieuwe student
        :returns: De nieuw aangemaakte student
        """
        raise NotImplementedError
