from sqlalchemy.orm import Session

from db.models.models import User
from domain.logic.admin import is_user_admin
from domain.logic.basic_operations import get, get_all
from domain.logic.role_enum import Role
from domain.logic.student import is_user_student
from domain.logic.teacher import is_user_teacher
from domain.models.APIUser import APIUser
from domain.models.UserDataclass import UserDataclass


def convert_user(session: Session, user: UserDataclass) -> APIUser:
    api_user = APIUser(id=user.id, name=user.name, email=user.email, roles=[])

    if is_user_teacher(session, user.id):
        api_user.roles.append(Role.TEACHER)

    if is_user_admin(session, user.id):
        api_user.roles.append(Role.ADMIN)

    if is_user_student(session, user.id):
        api_user.roles.append(Role.STUDENT)

    return api_user


def get_user(session: Session, user_id: int) -> UserDataclass:
    return get(session, User, user_id).to_domain_model()


def get_all_users(session: Session) -> list[UserDataclass]:
    return [user.to_domain_model() for user in get_all(session, User)]
