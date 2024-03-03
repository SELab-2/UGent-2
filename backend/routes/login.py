from fastapi import Depends

from db.implementation.SqlAdminDAO import SqlAdminDAO
from db.implementation.SqlUserDAO import SqlUserDAO
from domain.models.UserDataclass import UserDataclass


def get_authenticated_user() -> UserDataclass:
    return SqlUserDAO().get(1)  # Actually authenticate user


def is_user_admin(user: UserDataclass = Depends(get_authenticated_user)) -> bool:
    return SqlAdminDAO().is_user_admin(user.id)
