from sqlmodel import Session

from db.models.models import Student, User
from domain.logic.basic_operations import get, get_all


def create_student(session: Session, name: str, email: str) -> Student:
    """
    This function is meant to create a new user that is a student. It does not change the role of an existing user.
    """
    new_user: User = User(name=name, email=email)
    session.add(new_user)
    session.commit()
    new_student: Student = Student(id=new_user.id)
    session.add(new_student)
    session.commit()
    return new_student


def get_student(session: Session, student_id: int) -> Student:
    return get(session, Student, student_id)


def get_all_students(session: Session) -> list[Student]:
    return get_all(session, Student)


def is_user_student(session: Session, user_id: int) -> bool:
    student = session.get(Student, user_id)
    return student is not None
