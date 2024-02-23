from backend.db.errors.database_errors import ItemNotFoundError
from backend.db.extentions import db
from backend.db.interface.TeacherDAO import TeacherDAO
from backend.db.models.models import Teacher, TeacherDataclass


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
