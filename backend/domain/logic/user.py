from sqlalchemy import select
from sqlalchemy.orm import Session

from db.models.models import Admin, Student, Teacher, User
from domain.logic.admin import is_user_admin
from domain.logic.basic_operations import get, get_all
from domain.logic.role_enum import Role
from domain.logic.student import is_user_student
from domain.logic.teacher import is_user_teacher
from domain.models.APIUser import APIUser
from domain.models.UserDataclass import UserDataclass


def convert_user(session: Session, user: UserDataclass) -> APIUser:
    """
    Given a UserDataclass, check what roles that user has and fill those in to convert it to an APIUser.
    """
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


def get_user_with_email(session: Session, email: str) -> UserDataclass | None:
    stmt = select(User).where(User.email == email)
    result = session.execute(stmt)
    users = [r.to_domain_model() for r in result.scalars()]

    if len(users) > 1:
        raise NotImplementedError

    if len(users) == 1:
        return users[0]

    return None


def get_all_users(session: Session) -> list[UserDataclass]:
    return [user.to_domain_model() for user in get_all(session, User)]


def modify_user_roles(session: Session, uid: int, roles: list[Role]) -> None:
    # Er is geen ondersteuning om een student/teacher role af te nemen,
    # want dit zou problemen geven met relaties in de databank
    if Role.STUDENT in roles and session.get(Student, uid) is None:
        student = Student(id=uid)
        session.add(student)
    if Role.TEACHER in roles and session.get(Teacher, uid) is None:
        teacher = Teacher(id=uid)
        session.add(teacher)
    if Role.ADMIN in roles and session.get(Admin, uid) is None:
        admin = Admin(id=uid)
        session.add(admin)
    if Role.ADMIN not in roles and session.get(Admin, uid) is not None:
        session.delete(get(session, Admin, uid))
    session.commit()
