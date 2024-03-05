from typing import Type

from sqlalchemy.orm import Session

from db.errors.database_errors import UniqueConstraintError
from db.models.models import Subject, Teacher, Student
from domain.logic.basic_operations import get
from domain.models.SubjectDataclass import SubjectDataclass
from domain.models.UserDataclass import UserDataclass


def is_user_authorized_for_subject(subject: SubjectDataclass, user: UserDataclass) -> bool:
    teacher_dao = dao_provider.get_teacher_dao()
    student_dao = dao_provider.get_student_dao()
    subject_dao = dao_provider.get_subject_dao()  # TODO

    if teacher_dao.is_user_teacher(user.id) and subject in subject_dao.get_subjects_of_teacher(user.id):
        return True

    if student_dao.is_user_student(user.id) and subject in subject_dao.get_subjects_of_student(user.id):
        return True

    return False


def create_subject(session: Session, name: str) -> SubjectDataclass:
    new_subject = Subject(name=name)
    session.add(new_subject)
    session.commit()
    return new_subject.to_domain_model()


def get_subjects_of_teacher(session: Session, teacher_id: int) -> list[SubjectDataclass]:
    teacher: Teacher = get(session, Type[Teacher], ident=teacher_id)
    subjects: list[Subject] = teacher.subjects
    return [vak.to_domain_model() for vak in subjects]


def add_student_to_subject(session: Session, student_id: int, subject_id: int) -> None:
    student: Student = get(session, Type[Student], ident=student_id)
    subject: Subject = get(session, Type[Subject], ident=subject_id)

    if subject in student.subjects:
        msg = f"Student with id {student_id} already has subject with id {subject_id}"
        raise UniqueConstraintError(msg)

    student.subjects.append(subject)
    session.commit()


def add_teacher_to_subject(session: Session, teacher_id: int, subject_id: int) -> None:
    teacher: Teacher | None = get(session, Type[Teacher], ident=teacher_id)
    subject: Subject | None = get(session, Type[Subject], ident=subject_id)

    if subject in teacher.subjects:
        msg = f"Teacher with id {teacher_id} already has subject with id {subject_id}"
        raise UniqueConstraintError(msg)

    teacher.subjects.append(subject)
    session.commit()


def get_subjects_of_student(session: Session, student_id: int) -> list[SubjectDataclass]:
    student: Student = get(session, Type[Student], ident=student_id)
    subjects: list[Subject] = student.subjects
    return [vak.to_domain_model() for vak in subjects]
