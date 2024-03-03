from typing import TYPE_CHECKING

from db.interface.AbstractDAO import AbstractDAO

if TYPE_CHECKING:
    from db.models.models import User  # noqa: F401
    from domain.models.UserDataclass import UserDataclass  # noqa: F401


class UserDAO(AbstractDAO["User", "UserDataclass"]):
    pass
