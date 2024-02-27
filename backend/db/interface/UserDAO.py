from abc import ABC, abstractmethod

from domain.models.UserDataclass import UserDataclass


class UserDAO(ABC):
    @abstractmethod
    def get_user(self, ident: int) -> UserDataclass:
        """
        Haalt een user op aan de hand van zijn identificatie.

        :param ident: Het id van de te zoeken user.
        :return: De user die overeenkomt met de gegeven id.
        :raises ItemNotFoundException: Als geen user met het gegeven id gevonden werd.
        """
        raise NotImplementedError

    @abstractmethod
    def get_all_users(self) -> list[UserDataclass]:
        """
        Haalt alle users op.

        :return: Een lijst van alle users.
        """
        raise NotImplementedError
