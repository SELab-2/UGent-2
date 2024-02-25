from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.UserDAO import UserDAO
from db.models.models import User
from domain.models.models import UserDataclass


class SqlUserDAO(UserDAO):
    def get_user(self, ident: int) -> UserDataclass:
        user: User = User.query.get(ident=ident)

        if not user:
            raise ItemNotFoundError("UserDataClass with given id not found.")

        return user.to_domain_model()

    def get_all_users(self) -> list[UserDataclass]:
        users: list[User] = User.query.all()
        return [user.to_domain_model() for user in users]

    def create_user(self, user: UserDataclass):
        new_user: User = User()
        new_user.email = user.email
        new_user.name = user.name

        db.session.add(new_user)
        db.session.commit()

        user.id = new_user.id
