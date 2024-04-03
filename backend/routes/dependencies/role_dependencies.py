from fastapi import Depends
from fastapi.security import APIKeyHeader

from controllers.auth.token_controller import verify_token
from db.sessions import get_session
from domain.logic.admin import get_admin, is_user_admin
from domain.logic.group import get_group, get_students_of_group
from domain.logic.project import get_project, get_projects_of_student, get_projects_of_teacher
from domain.logic.student import get_student, is_user_student
from domain.logic.subject import get_subjects_of_student, get_subjects_of_teacher, is_user_authorized_for_subject
from domain.logic.teacher import get_teacher, is_user_teacher
from domain.models.AdminDataclass import AdminDataclass
from domain.models.StudentDataclass import StudentDataclass
from domain.models.TeacherDataclass import TeacherDataclass
from routes.errors.authentication import (
    InvalidAdminCredentialsError,
    InvalidAuthenticationError,
    InvalidStudentCredentialsError,
    InvalidTeacherCredentialsError,
    NoAccessToDataError,
)

auth_scheme = APIKeyHeader(name="cas")


def get_authenticated_user(token: str = Depends(auth_scheme)) -> int:
    uid = verify_token(token)
    if uid is None:
        raise InvalidAuthenticationError
    return uid


def get_authenticated_admin() -> AdminDataclass:
    session = next(get_session())
    uid = get_authenticated_user()

    if not is_user_admin(session, uid):
        raise InvalidAdminCredentialsError
    return get_admin(session, uid)


def get_authenticated_teacher() -> TeacherDataclass:
    session = next(get_session())
    uid = get_authenticated_user()

    if not is_user_teacher(session, uid):
        raise InvalidTeacherCredentialsError
    return get_teacher(session, uid)


def get_authenticated_student() -> StudentDataclass:
    session = next(get_session())
    uid = get_authenticated_user()

    if not is_user_student(session, uid):
        raise InvalidStudentCredentialsError

    return get_student(session, uid)


def ensure_user_authorized_for_subject(subject_id: int) -> None:
    session = next(get_session())
    uid = get_authenticated_user()

    if not is_user_authorized_for_subject(subject_id, session, uid):
        raise NoAccessToDataError


def ensure_user_authorized_for_project(project_id: int) -> None:
    session = next(get_session())
    uid = get_authenticated_user()

    project = get_project(session, project_id)
    if not is_user_authorized_for_subject(project.subject_id, session, uid):
        raise NoAccessToDataError


def ensure_student_authorized_for_subject(subject_id: int) -> StudentDataclass:
    session = next(get_session())
    student = get_authenticated_student()

    subjects_of_student = get_subjects_of_student(session, student.id)
    if subject_id not in [subject.id for subject in subjects_of_student]:
        raise NoAccessToDataError
    return student


def ensure_teacher_authorized_for_subject(subject_id: int) -> TeacherDataclass:
    session = next(get_session())
    teacher = get_authenticated_teacher()

    subjects_of_teacher = get_subjects_of_teacher(session, teacher.id)
    if subject_id not in [subject.id for subject in subjects_of_teacher]:
        raise NoAccessToDataError
    return teacher


def ensure_student_authorized_for_project(project_id: int) -> StudentDataclass:
    session = next(get_session())
    student = get_authenticated_student()

    projects_of_student = get_projects_of_student(session, student.id)
    if project_id not in [project.id for project in projects_of_student]:
        raise NoAccessToDataError
    return student


def ensure_teacher_authorized_for_project(project_id: int) -> TeacherDataclass:
    session = next(get_session())
    teacher = get_authenticated_teacher()

    projects_of_teacher = get_projects_of_teacher(session, teacher.id)
    if project_id not in [project.id for project in projects_of_teacher]:
        raise NoAccessToDataError
    return teacher


def ensure_student_authorized_for_group(group_id: int) -> StudentDataclass:
    session = next(get_session())
    student = get_authenticated_student()

    group = get_group(session, group_id)
    projects_of_student = get_projects_of_student(session, student.id)
    if group.project_id not in [project.id for project in projects_of_student]:
        raise NoAccessToDataError
    return student


def ensure_user_authorized_for_group(group_id: int) -> None:
    session = next(get_session())
    uid = get_authenticated_user()

    group = get_group(session, group_id)
    project = get_project(session, group.project_id)
    if not is_user_authorized_for_subject(project.subject_id, session, uid):
        raise NoAccessToDataError


def ensure_student_in_group(group_id: int) -> StudentDataclass:
    session = next(get_session())
    student = get_authenticated_student()

    if student not in get_students_of_group(session, group_id):
        raise NoAccessToDataError
    return student


def ensure_user_authorized_for_submission(group_id: int) -> None:
    session = next(get_session())
    uid = get_authenticated_user()

    group = get_group(session, group_id)
    if is_user_student(session, uid):
        student = get_student(session, uid)
        if student in get_students_of_group(session, group_id):
            return
    if (
            is_user_teacher(session, uid) and
            get_project(session, group.project_id) in get_projects_of_teacher(session, uid)
    ):
        return
    raise NoAccessToDataError
