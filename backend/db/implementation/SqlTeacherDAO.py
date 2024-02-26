from sqlalchemy import select

from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.TeacherDAO import TeacherDAO
from db.models.models import Teacher
from domain.models.TeacherDataclass import TeacherDataclass


class SqlTeacherDAO(TeacherDAO):
    def get_teacher(self, ident: int) -> TeacherDataclass:
        teacher: Teacher | None = db.session.get(Teacher, ident)

        if not teacher:
            msg = f"Teacher with id {ident} not found"
            raise ItemNotFoundError(msg)

        return teacher.to_domain_model()

    def get_all_teachers(self) -> list[TeacherDataclass]:
        teachers: list[Teacher] = list(db.session.scalars(select(Teacher)).all())
        return [teacher.to_domain_model() for teacher in teachers]

    def create_teacher(self, name: str, email: str) -> None:
        new_teacher = Teacher(name=name, email=email)
        db.session.add(new_teacher)
        db.session.commit()
