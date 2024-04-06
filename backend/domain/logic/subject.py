from sqlmodel import Session

from db.errors.database_errors import ActionAlreadyPerformedError
from db.models.models import Student, Subject, Teacher
from domain.logic.basic_operations import get, get_all
from domain.logic.student import is_user_student
from domain.logic.teacher import is_user_teacher


def create_subject(session: Session, name: str) -> Subject:
    new_subject = Subject(name=name)
    session.add(new_subject)
    session.commit()
    return new_subject


def get_subject(session: Session, subject_id: int) -> Subject:
    return get(session, Subject, subject_id)


def get_all_subjects(session: Session) -> list[Subject]:
    return get_all(session, Subject)


def get_subjects_of_teacher(session: Session, teacher_id: int) -> list[Subject]:
    teacher: Teacher = get(session, Teacher, ident=teacher_id)
    return teacher.subjects


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


def get_subjects_of_student(session: Session, student_id: int) -> list[Subject]:
    student: Student = get(session, Student, ident=student_id)
    return student.subjects


def is_user_authorized_for_subject(subject_id: int, session: Session, uid: int) -> bool:
    subjects = []
    if is_user_teacher(session, uid):
        subjects += get_subjects_of_teacher(session, uid)
    if is_user_student(session, uid):
        subjects += get_subjects_of_student(session, uid)
    if subject_id in [subject.id for subject in subjects]:
        return True
    return False


def get_teachers_of_subject(session: Session, subject_id: int) -> list[Teacher]:
    subject: Subject = get(session, Subject, ident=subject_id)
    return subject.teachers


def get_students_of_subject(session: Session, subject_id: int) -> list[Student]:
    subject: Subject = get(session, Subject, ident=subject_id)
    return subject.students
