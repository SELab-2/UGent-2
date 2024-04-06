from sqlmodel import Session

from db.models.models import Teacher, User
from domain.logic.basic_operations import get, get_all


def create_teacher(session: Session, name: str, email: str) -> Teacher:
    """
    This function is meant to create a new user that is a teacher. It does not change the role of an existing user.
    """
    new_user: User = User(name=name, email=email)
    session.add(new_user)
    session.commit()
    assert new_user.id is not None
    new_teacher: Teacher = Teacher(id=new_user.id)
    session.add(new_teacher)
    session.commit()
    return new_teacher


def get_teacher(session: Session, teacher_id: int) -> Teacher:
    return get(session, Teacher, teacher_id)


def get_all_teachers(session: Session) -> list[Teacher]:
    return get_all(session, Teacher)


def is_user_teacher(session: Session, user_id: int) -> bool:
    teacher = session.get(Teacher, user_id)
    return teacher is not None
