from sqlalchemy.orm import Session

from db.extensions import engine
from db.implementation.SqlAbstractDAO import SqlAbstractDAO
from db.interface.TeacherDAO import TeacherDAO
from db.models.models import Teacher
from domain.models.TeacherDataclass import TeacherDataclass


class SqlTeacherDAO(SqlAbstractDAO[Teacher, TeacherDataclass], TeacherDAO):
    def __init__(self) -> None:
        self.model_class = Teacher

    def create_teacher(self, name: str, email: str) -> TeacherDataclass:
        with Session(engine) as session:
            new_teacher = Teacher(name=name, email=email)
            session.add(new_teacher)
            session.commit()
            return new_teacher.to_domain_model()

    def is_user_teacher(self, user_id: int) -> bool:
        with Session(engine) as session:
            teacher = session.get(Teacher, user_id)
            return teacher is not None
