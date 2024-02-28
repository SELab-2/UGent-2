from db.implementation.SqlAbstractDAO import SqlAbstractDAO
from db.interface.UserDAO import UserDAO
from db.models.models import User
from domain.models.UserDataclass import UserDataclass


class SqlUserDAO(SqlAbstractDAO[User, UserDataclass], UserDAO):
    def __init__(self) -> None:
        self.model_class = User
