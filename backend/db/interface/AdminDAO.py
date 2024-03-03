from abc import abstractmethod
from typing import TYPE_CHECKING

from db.interface.AbstractDAO import AbstractDAO

if TYPE_CHECKING:
    from db.models.models import Admin  # noqa: F401
    from domain.models.AdminDataclass import AdminDataclass


class AdminDAO(AbstractDAO["Admin", "AdminDataclass"]):
    @abstractmethod
    def create_admin(self, name: str, email: str) -> "AdminDataclass":
        """
        Maakt een nieuwe admin aan.

        :param name: De naam van de nieuwe admin.
        :param email: De email van de nieuwe admin.
        :return: De nieuwe admin
        """
        raise NotImplementedError

    @abstractmethod
    def is_user_admin(self, user_id: int) -> bool:
        raise NotImplementedError
