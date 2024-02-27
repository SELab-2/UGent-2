from sqlalchemy import select

from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.UserDAO import UserDAO
from db.models.models import User
from domain.models.UserDataclass import UserDataclass


class SqlUserDAO(UserDAO):
    def get_user(self, ident: int) -> UserDataclass:
        user: User | None = db.session.get(User, ident=ident)
        if not user:
            msg = f"User with id {ident} not found"
            raise ItemNotFoundError(msg)
        return user.to_domain_model()

    def get_all_users(self) -> list[UserDataclass]:
        users: list[User] = list(db.session.scalars(select(User)).all())
        return [user.to_domain_model() for user in users]

