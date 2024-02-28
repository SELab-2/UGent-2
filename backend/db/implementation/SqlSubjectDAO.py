from db.errors.database_errors import ItemNotFoundError, UniqueConstraintError
from sqlalchemy.orm import Session

from db.extensions import engine
from db.implementation.SqlAbstractDAO import SqlAbstractDAO
from db.interface.AbstractDAO import D
from db.interface.SubjectDAO import SubjectDAO
from db.models.models import Student, Subject, Teacher
from domain.models.SubjectDataclass import SubjectDataclass


class SqlSubjectDAO(SubjectDAO, SqlAbstractDAO[Subject, SubjectDataclass]):

    @staticmethod
    def get_all() -> list[SubjectDataclass]:
        return SqlAbstractDAO.get_all()

    @staticmethod
    def get_object(ident: int) -> SubjectDataclass:
        return SqlAbstractDAO.get_object(ident)

    @staticmethod
    def create_subject(name: str) -> SubjectDataclass:
        with Session(engine) as session:
            new_subject = Subject(name=name)
            session.add(new_subject)
            session.commit()
            return new_subject.to_domain_model()

    @staticmethod
    def get_subjects_of_teacher(teacher_id: int) -> list[SubjectDataclass]:
        with Session(engine) as session:
            teacher: Teacher | None = session.get(Teacher, ident=teacher_id)
            if not teacher:
                msg = f"Teacher with id {teacher_id} not found"
                raise ItemNotFoundError(msg)
            subjects: list[Subject] = teacher.subjects
            return [vak.to_domain_model() for vak in subjects]

    @staticmethod
    def add_student_to_subject(student_id: int, subject_id: int) -> None:
        with Session(engine) as session:
            student: Student | None = session.get(Student, ident=student_id)
            subject: Subject | None = session.get(Subject, ident=subject_id)

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
            session.commit()

    @staticmethod
    def add_teacher_to_subject(teacher_id: int, subject_id: int) -> None:
        with Session(engine) as session:
            teacher: Teacher | None = session.get(Teacher, ident=teacher_id)
            subject: Subject | None = session.get(Subject, ident=subject_id)

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
            session.commit()

    @staticmethod
    def get_subjects_of_student(student_id: int) -> list[SubjectDataclass]:
        with Session(engine) as session:
            student: Student | None = session.get(Student, ident=student_id)
            if not student:
                msg = f"Student with id {student_id} not found"
                raise ItemNotFoundError(msg)
            subjects: list[Subject] = student.subjects
            return [vak.to_domain_model() for vak in subjects]
