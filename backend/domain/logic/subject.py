from sqlalchemy.orm import Session

from db.errors.database_errors import ActionAlreadyPerformedError
from db.models.models import Student, Subject, Teacher
from domain.logic.basic_operations import get, get_all
from domain.models.SubjectDataclass import SubjectDataclass


def create_subject(session: Session, name: str) -> SubjectDataclass:
    new_subject = Subject(name=name)
    session.add(new_subject)
    session.commit()
    return new_subject.to_domain_model()


def get_subject(session: Session, subject_id: int) -> SubjectDataclass:
    return get(session, Subject, subject_id).to_domain_model()


def get_all_subjects(session: Session) -> list[SubjectDataclass]:
    return [subject.to_domain_model() for subject in get_all(session, Subject)]


def get_subjects_of_teacher(session: Session, teacher_id: int) -> list[SubjectDataclass]:
    teacher: Teacher = get(session, Teacher, ident=teacher_id)
    subjects: list[Subject] = teacher.subjects
    return [vak.to_domain_model() for vak in subjects]


def add_student_to_subject(session: Session, student_id: int, subject_id: int) -> None:
    student: Student = get(session, Student, ident=student_id)
    subject: Subject = get(session, Subject, ident=subject_id)

    if subject in student.subjects:
        msg = f"Student with id {student_id} already has subject with id {subject_id}"
        raise ActionAlreadyPerformedError(msg)

    student.subjects.append(subject)
    session.commit()


def add_teacher_to_subject(session: Session, teacher_id: int, subject_id: int) -> None:
    teacher: Teacher | None = get(session, Teacher, ident=teacher_id)
    subject: Subject | None = get(session, Subject, ident=subject_id)

    if subject in teacher.subjects:
        msg = f"Teacher with id {teacher_id} already has subject with id {subject_id}"
        raise ActionAlreadyPerformedError(msg)

    teacher.subjects.append(subject)
    session.commit()


def get_subjects_of_student(session: Session, student_id: int) -> list[SubjectDataclass]:
    student: Student = get(session, Student, ident=student_id)
    subjects: list[Subject] = student.subjects
    return [vak.to_domain_model() for vak in subjects]
