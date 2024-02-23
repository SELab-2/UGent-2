from backend.db.errors.database_errors import ItemNotFoundError
from backend.db.extentions import db
from backend.db.interface.SubjectDAO import SubjectDAO
from backend.db.models.models import SubjectModel, TeacherModel
from backend.domain.models.models import Subject


class SqlSubjectDAO(SubjectDAO):

    def create_subject(self, subject: Subject, teacher_id: int):
        teacher = TeacherModel.query.get(teacher_id)

        if not teacher:
            raise ItemNotFoundError(f"De teacher met id {teacher_id} kon niet in de databank gevonden worden")

        new_subject = SubjectModel(name=subject.name, teacher=teacher)

        db.session.add(new_subject)
        db.session.commit()

        subject.id = new_subject.id

    def get_subject(self, teacher_id: int):
        subject = SubjectModel.query.get(teacher_id)
        if not subject:
            raise ItemNotFoundError(f"De lesgever met id {teacher_id} kon niet in de databank gevonden worden")

        return subject.to_domain_model()

    def get_subjects(self, teacher_id: int) -> list[Subject]:
        teacher: TeacherModel = TeacherModel.query.get(ident=teacher_id)

        if not teacher:
            raise ItemNotFoundError(f"De teacher met id {teacher_id} kon niet in de databank gevonden worden")

        subjects: list[SubjectModel] = teacher.subjects
        return [vak.to_domain_model() for vak in subjects]
