from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.TeacherDAO import TeacherDAO
from db.models.models import Teacher
from domain.models.models import TeacherDataclass


class SqlTeacherDAO(TeacherDAO):
    def get_teacher(self, ident: int):
        teacher: Teacher = Teacher.query.get(ident=ident)

        if not teacher:
            raise ItemNotFoundError("TeacherDataclass with given id not found.")

        return teacher.to_domain_model()

    def get_all_teachers(self) -> list[TeacherDataclass]:
        teachers: list[Teacher] = Teacher.query.all()
        return [lesgever.to_domain_model() for lesgever in teachers]

    def create_teacher(self, teacher: TeacherDataclass):
        new_teacher = Teacher(name=teacher.name)

        db.session.add(new_teacher)
        db.session.commit()

        teacher.id = new_teacher.id
