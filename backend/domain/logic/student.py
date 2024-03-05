from sqlalchemy.orm import Session

from db.models.models import Student
from domain.models.StudentDataclass import StudentDataclass


def create_student(session: Session, name: str, email: str) -> StudentDataclass:
    new_student: Student = Student(name=name, email=email)
    session.add(new_student)
    session.commit()
    return new_student.to_domain_model()


def is_user_student(session: Session, user_id: int) -> bool:
    student = session.get(Student, user_id)
    return student is not None
