from sqlalchemy.orm import Session
from db.extensions import engine
from db.implementation.SqlAbstractDAO import SqlAbstractDAO
from db.interface.AbstractDAO import D
from db.interface.TeacherDAO import TeacherDAO
from db.models.models import Teacher
from domain.models.TeacherDataclass import TeacherDataclass


class SqlTeacherDAO(TeacherDAO, SqlAbstractDAO[Teacher, TeacherDataclass]):

    @staticmethod
    def get_all() -> list[TeacherDataclass]:
        return SqlAbstractDAO.get_all()

    @staticmethod
    def get_object(ident: int) -> TeacherDataclass:
        return SqlAbstractDAO.get_object(ident)

    @staticmethod
    def create_teacher(name: str, email: str) -> TeacherDataclass:
        with Session(engine) as session:
            new_teacher = Teacher(name=name, email=email)
            session.add(new_teacher)
            session.commit()
            return new_teacher.to_domain_model()
