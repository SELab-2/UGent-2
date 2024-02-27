from sqlalchemy import select

from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.StudentDAO import StudentDAO
from db.models.models import Student
from domain.models.StudentDataclass import StudentDataclass


class SqlStudentDAO(StudentDAO):
    def get_student(self, ident: int) -> StudentDataclass:
        student: Student | None = db.session.get(Student, ident=ident)
        if not student:
            msg = f"Student with id {ident} not found"
            raise ItemNotFoundError(msg)
        return student.to_domain_model()

    def get_all_students(self) -> list[StudentDataclass]:
        students: list[Student] = list(db.session.scalars(select(Student)).all())
        return [student.to_domain_model() for student in students]

    def create_student(self, name: str, email: str) -> StudentDataclass:
        new_student: Student = Student(name=name, email=email)
        db.session.add(new_student)
        db.session.commit()
        return new_student.to_domain_model()
