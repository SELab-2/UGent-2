from sqlalchemy.orm import Session

from db.extensions import engine
from db.implementation.SqlAbstractDAO import SqlAbstractDAO
from db.interface.StudentDAO import StudentDAO
from db.models.models import Student
from domain.models.StudentDataclass import StudentDataclass


class SqlStudentDAO(SqlAbstractDAO[Student, StudentDataclass], StudentDAO):
    def __init__(self) -> None:
        self.model_class = Student

    def create_student(self, name: str, email: str) -> StudentDataclass:
        with Session(engine) as session:
            new_student: Student = Student(name=name, email=email)
            session.add(new_student)
            session.commit()
            return new_student.to_domain_model()
