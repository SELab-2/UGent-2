from sqlalchemy.orm import Session

from db.models.models import Teacher, User
from domain.logic.basic_operations import get, get_all
from domain.models.TeacherDataclass import TeacherDataclass


def create_teacher(session: Session, name: str, email: str) -> TeacherDataclass:
    """
    This function is meant creating a new user that is a teacher. It does not change the role of an existing user.
    """
    new_user: User = User(name=name, email=email)
    session.add(new_user)
    session.commit()
    new_teacher: Teacher = Teacher(id=new_user.id)
    session.add(new_teacher)
    session.commit()
    return new_teacher.to_domain_model()


def get_teacher(session: Session, teacher_id: int) -> TeacherDataclass:
    return get(session, Teacher, teacher_id).to_domain_model()


def get_all_teachers(session: Session) -> list[TeacherDataclass]:
    return [teacher.to_domain_model() for teacher in get_all(session, Teacher)]


def is_user_teacher(session: Session, user_id: int) -> bool:
    teacher = session.get(Teacher, user_id)
    return teacher is not None
