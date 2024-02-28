from db.implementation.SqlAbstractDAO import SqlAbstractDAO
from db.interface.UserDAO import UserDAO
from db.models.models import User
from domain.models.UserDataclass import UserDataclass


class SqlUserDAO(UserDAO, SqlAbstractDAO[User, UserDataclass]):
    @staticmethod
    def get_all() -> list[UserDataclass]:
        return SqlAbstractDAO.get_all()

    @staticmethod
    def get_object(ident: int) -> UserDataclass:
        return SqlAbstractDAO.get_object(ident)
