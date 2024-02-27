from abc import ABC, abstractmethod

from domain.models.AdminDataclass import AdminDataclass


class AdminDAO(ABC):
    @abstractmethod
    def get_admin(self, ident: int) -> AdminDataclass:
        """
        Haalt een admin op aan de hand van zijn identificatie.

        :param ident: Het id van de te zoeken admin.
        :return: De admin die overeenkomt met de gegeven id.
        :raises ItemNotFoundException: Als geen admin met het gegeven id gevonden werd.
        """
        raise NotImplementedError

    @abstractmethod
    def get_all_admins(self) -> list[AdminDataclass]:
        """
        Haalt alle admins op.

        :return: Een lijst van alle admins.
        """
        raise NotImplementedError

    @abstractmethod
    def create_admin(self, name: str, email: str) -> AdminDataclass:
        """
        Maakt een nieuwe admin aan.

        :param name: De naam van de nieuwe admin.
        :param email: De email van de nieuwe admin.
        :return: De nieuwe admin
        """
        raise NotImplementedError