from abc import ABC

from db.interface.AbstractDAO import AbstractDAO
from db.models.models import User
from domain.models.UserDataclass import UserDataclass


class UserDAO(AbstractDAO[User, UserDataclass], ABC):
    pass
