
from sqlalchemy.orm import Session

from db.extensions import engine
from db.implementation.SqlAbstractDAO import SqlAbstractDAO
from db.interface.StudentDAO import StudentDAO
from db.models.models import Student
from domain.models.StudentDataclass import StudentDataclass


class SqlStudentDAO(StudentDAO, SqlAbstractDAO[Student, StudentDataclass]):

    @staticmethod
    def get_all() -> list[StudentDataclass]:
        return SqlAbstractDAO.get_all()

    @staticmethod
    def get_object(ident: int) -> StudentDataclass:
        return SqlAbstractDAO.get_object(ident)

    @staticmethod
    def create_student(name: str, email: str) -> StudentDataclass:
        with Session(engine) as session:
            new_student: Student = Student(name=name, email=email)
            session.add(new_student)
            session.commit()
            return new_student.to_domain_model()
