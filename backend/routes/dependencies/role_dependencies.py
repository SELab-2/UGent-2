from fastapi import Depends
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.admin import get_admin, is_user_admin
from domain.logic.student import get_student, is_user_student
from domain.logic.subject import get_subjects_of_student, get_subjects_of_teacher
from domain.logic.teacher import get_teacher, is_user_teacher
from domain.models.AdminDataclass import AdminDataclass
from domain.models.StudentDataclass import StudentDataclass
from domain.models.SubjectDataclass import SubjectDataclass
from domain.models.TeacherDataclass import TeacherDataclass
from routes.errors.authentication import (
    InvalidAdminCredentialsError,
    InvalidStudentCredentialsError,
    InvalidTeacherCredentialsError,
    StudentNotEnrolledError,
)


def get_authenticated_user() -> int:
    return 1  # Checken of een user bestaat en/of hij de juiste credentials heeft.


def get_authenticated_admin(session: Session = Depends(get_session)) -> AdminDataclass:
    user_id = get_authenticated_user()
    if not is_user_admin(session, user_id):
        raise InvalidAdminCredentialsError
    return get_admin(session, user_id)


def get_authenticated_teacher(session: Session = Depends(get_session)) -> TeacherDataclass:
    user_id = get_authenticated_user()
    if not is_user_teacher(session, user_id):
        raise InvalidTeacherCredentialsError
    return get_teacher(session, user_id)


def get_authenticated_student(session: Session = Depends(get_session)) -> StudentDataclass:
    user_id = get_authenticated_user()
    if not is_user_student(session, user_id):
        raise InvalidStudentCredentialsError
    return get_student(session, user_id)


def is_user_authorized_for_subject(session: Session, subject_id: int) -> bool:
    user_id = get_authenticated_user()
    if is_user_teacher(session, user_id):
        subjects_of_teacher: list[SubjectDataclass] = get_subjects_of_teacher(session, subject_id)
        return subject_id in [subject.id for subject in subjects_of_teacher]

    if is_user_student(session, user_id):
        subjects_of_student: list[SubjectDataclass] = get_subjects_of_student(session, subject_id)
        return subject_id in [subject.id for subject in subjects_of_student]

    return False


def get_authenticated_student_for_subject(
        subject_id: int,
        session: Session = Depends(get_session),
        student: StudentDataclass = Depends(get_authenticated_student),
) -> StudentDataclass:
    subjects_of_student = get_subjects_of_student(session, student.id)
    if subject_id not in [subject.id for subject in subjects_of_student]:
        raise StudentNotEnrolledError
    return student

