from abc import abstractmethod

from db.interface.AbstractDAO import AbstractDAO
from db.models.models import Admin
from domain.models.AdminDataclass import AdminDataclass


class AdminDAO(AbstractDAO[Admin, AdminDataclass]):
    @abstractmethod
    def create_admin(self, name: str, email: str) -> AdminDataclass:
        """
        Maakt een nieuwe admin aan.

        :param name: De naam van de nieuwe admin.
        :param email: De email van de nieuwe admin.
        :return: De nieuwe admin
        """
        raise NotImplementedError
