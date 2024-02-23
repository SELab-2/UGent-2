from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.SubjectDAO import SubjectDAO
from db.models.models import Subject, Teacher
from domain.models.models import SubjectDataclass


class SqlSubjectDAO(SubjectDAO):

    def create_subject(self, subject: SubjectDataclass, teacher_id: int):
        teacher = Teacher.query.get(teacher_id)

        if not teacher:
            raise ItemNotFoundError(f"De teacher met id {teacher_id} kon niet in de databank gevonden worden")

        new_subject = Subject(name=subject.name, teacher=teacher)

        db.session.add(new_subject)
        db.session.commit()

        subject.id = new_subject.id

    def get_subject(self, teacher_id: int):
        subject = Subject.query.get(teacher_id)
        if not subject:
            raise ItemNotFoundError(f"De lesgever met id {teacher_id} kon niet in de databank gevonden worden")

        return subject.to_domain_model()

    def get_subjects(self, teacher_id: int) -> list[SubjectDataclass]:
        teacher: Teacher = Teacher.query.get(ident=teacher_id)

        if not teacher:
            raise ItemNotFoundError(f"De teacher met id {teacher_id} kon niet in de databank gevonden worden")

        subjects: list[Subject] = teacher.subjects
        return [vak.to_domain_model() for vak in subjects]
