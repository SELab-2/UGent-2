from backend.db.errors.database_errors import ItemNotFoundError
from backend.db.extentions import db
from backend.db.interface.TeacherDAO import TeacherDAO
from backend.db.models.models import TeacherDataclass, TeacherModel


class SqlTeacherDAO(TeacherDAO):

    def get_teacher(self, ident: int):
        teacher: TeacherModel = TeacherModel.query.get(ident=ident)

        if not teacher:
            raise ItemNotFoundError("TeacherDataclass with given id not found.")

        return teacher.to_domain_model()

    def get_all_teachers(self) -> list[TeacherDataclass]:
        teachers: list[TeacherModel] = TeacherModel.query.all()
        return [lesgever.to_domain_model() for lesgever in teachers]

    def create_teacher(self, teacher: TeacherDataclass):
        new_teacher = TeacherModel(name=teacher.name)

        db.session.add(new_teacher)
        db.session.commit()

        teacher.id = new_teacher.id
