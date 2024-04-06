from sqlmodel import Session, select

from db.models.models import Admin, Student, Teacher, User
from domain.logic.basic_operations import get, get_all
from domain.logic.role_enum import Role


def get_user(session: Session, user_id: int) -> User:
    return get(session, User, user_id)


def get_user_with_email(session: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    result = session.execute(stmt)
    users = result.scalars().all()

    if len(users) > 1:
        raise NotImplementedError

    if len(users) == 1:
        return users[0]

    return None


def get_all_users(session: Session) -> list[User]:
    return get_all(session, User)


def modify_user_roles(session: Session, uid: int, roles: list[Role]) -> None:
    # Er is geen ondersteuning om een student/teacher role af te nemen,
    # want dit zou problemen geven met relaties in de databank
    user: User = get_user(session, uid)

    # Add Student Role
    if Role.STUDENT in roles and Role.STUDENT not in user.roles:
        student = Student(id=uid)
        session.add(student)

    # Add Teacher Role
    if Role.TEACHER in roles and Role.TEACHER not in user.roles:
        teacher = Teacher(id=uid)
        session.add(teacher)

    # Add Admin Role
    if Role.ADMIN in roles and Role.ADMIN not in user.roles:
        admin = Admin(id=uid)
        session.add(admin)

    # Remove Admin Role
    if Role.ADMIN not in roles and Role.ADMIN in user.roles:
        session.delete(get(session, Admin, uid))
    session.commit()


def modify_language(session: Session, user_id: int, language: str) -> None:
    user = get(session, User, user_id)
    user.language = language
    session.commit()
