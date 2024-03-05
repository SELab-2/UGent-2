from sqlalchemy.orm import Session

from db.models.models import Teacher
from domain.models.TeacherDataclass import TeacherDataclass


def create_teacher(session: Session, name: str, email: str) -> TeacherDataclass:
    new_teacher: Teacher = Teacher(name=name, email=email)
    session.add(new_teacher)
    session.commit()
    return new_teacher.to_domain_model()


def is_user_teacher(session: Session, user_id: int) -> bool:
    teacher = session.get(Teacher, user_id)
    return teacher is not None
