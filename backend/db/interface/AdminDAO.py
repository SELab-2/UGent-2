from abc import ABC, abstractmethod

from domain.models.AdminDataclass import AdminDataclass


class AdminDAO(ABC):
    @abstractmethod
    def create_admin(self, name: str, email: str) -> AdminDataclass:
        """
        Maakt een nieuwe admin aan.

        :param name: De naam van de nieuwe admin.
        :param email: De email van de nieuwe admin.
        :return: De nieuwe admin
        """
        raise NotImplementedError
