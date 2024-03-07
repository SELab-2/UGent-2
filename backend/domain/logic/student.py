from sqlalchemy.orm import Session

from db.models.models import Student
from domain.logic.basic_operations import get, get_all
from domain.models.StudentDataclass import StudentDataclass


def create_student(session: Session, name: str, email: str) -> StudentDataclass:
    new_student: Student = Student(name=name, email=email)
    session.add(new_student)
    session.commit()
    return new_student.to_domain_model()


def get_student(session: Session, student_id: int) -> StudentDataclass:
    return get(session, Student, student_id).to_domain_model()


def get_all_students(session: Session) -> list[StudentDataclass]:
    return [student.to_domain_model() for student in get_all(session, Student)]


def is_user_student(session: Session, user_id: int) -> bool:
    student = session.get(Student, user_id)
    return student is not None
