from db.errors.database_errors import ItemNotFoundError, UniqueConstraintError
from db.extensions import db
from db.interface.SubjectDAO import SubjectDAO
from db.models.models import Student, Subject, Teacher
from domain.models.SubjectDataclass import SubjectDataclass


class SqlSubjectDAO(SubjectDAO):
    def create_subject(self, name: str) -> None:
        new_subject = Subject(name=name)
        db.session.add(new_subject)
        db.session.commit()

    def get_subject(self, subject_id: int) -> SubjectDataclass:
        subject: Subject | None = db.session.get(Subject, ident=subject_id)
        if not subject:
            msg = f"Subject with id {subject_id} not found"
            raise ItemNotFoundError(msg)
        return subject.to_domain_model()

    def get_subjects_of_teacher(self, teacher_id: int) -> list[SubjectDataclass]:
        teacher: Teacher | None = db.session.get(Teacher, ident=teacher_id)
        if not teacher:
            msg = f"Teacher with id {teacher_id} not found"
            raise ItemNotFoundError(msg)
        subjects: list[Subject] = teacher.subjects
        return [vak.to_domain_model() for vak in subjects]

    def get_subjects_of_student(self, student_id: int) -> list[SubjectDataclass]:
        student: Student | None = db.session.get(Student, ident=student_id)
        if not student:
            msg = f"Student with id {student_id} not found"
            raise ItemNotFoundError(msg)
        subjects: list[Subject] = student.subjects
        return [vak.to_domain_model() for vak in subjects]

    def add_student_to_subject(self, student_id: int, subject_id: int) -> None:
        student: Student | None = db.session.get(Student, ident=student_id)
        subject: Subject | None = db.session.get(Subject, ident=subject_id)

        if not student:
            msg = f"Student with id {student_id} not found"
            raise ItemNotFoundError(msg)
        if not subject:
            msg = f"Subject with id {subject_id} not found"
            raise ItemNotFoundError(msg)
        if subject in student.subjects:
            msg = f"Student with id {student_id} already has subject with id {subject_id}"
            raise UniqueConstraintError(msg)

        student.subjects.append(subject)
        db.session.add(student)
        db.session.commit()

    def add_teacher_to_subject(self, teacher_id: int, subject_id: int) -> None:
        teacher: Teacher | None = db.session.get(Teacher, ident=teacher_id)
        subject: Subject | None = db.session.get(Subject, ident=subject_id)

        if not teacher:
            msg = f"Teacher with id {teacher_id} not found"
            raise ItemNotFoundError(msg)
        if not subject:
            msg = f"Subject with id {subject_id} not found"
            raise ItemNotFoundError(msg)
        if subject in teacher.subjects:
            msg = f"Teacher with id {teacher_id} already has subject with id {subject_id}"
            raise UniqueConstraintError(msg)

        teacher.subjects.append(subject)
        db.session.add(teacher)
        db.session.commit()
