from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.TeacherDAO import TeacherDAO
from db.models.models import Teacher, User
from domain.models.models import TeacherDataclass


class SqlTeacherDAO(TeacherDAO):
    def get_teacher(self, ident: int):
        teacher: Teacher = Teacher.query.get(ident=ident)

        if not teacher:
            raise ItemNotFoundError("TeacherDataclass with given id not found.")

        return teacher.to_domain_model()

    def get_all_teachers(self) -> list[TeacherDataclass]:
        teachers: list[Teacher] = Teacher.query.all()
        return [teacher.to_domain_model() for teacher in teachers]

    def create_teacher(self, user_id: int):
        user: User = User.query.get(ident=user_id)

        if not user:
            raise ItemNotFoundError("User with given id not found.")

        new_teacher: Teacher = Teacher()
        new_teacher.id = user_id

        db.session.add(new_teacher)
        db.session.commit()
