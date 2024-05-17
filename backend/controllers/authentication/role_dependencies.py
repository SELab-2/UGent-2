from starlette.requests import Request

from controllers.authentication.token_controller import verify_token
from db.models import Admin, Student, Teacher
from domain.logic.admin import get_admin, is_user_admin
from domain.logic.course import get_courses_of_student, get_courses_of_teacher, is_user_authorized_for_course
from domain.logic.group import get_group, get_students_of_group
from domain.logic.project import get_project, get_projects_of_teacher
from domain.logic.student import get_student, is_user_student
from domain.logic.teacher import get_teacher, is_user_teacher
from errors.authentication_errors import (
    InvalidAdminCredentialsError,
    InvalidAuthenticationError,
    InvalidStudentCredentialsError,
    InvalidTeacherCredentialsError,
    NoAccessToDataError,
)


def get_authenticated_user(request: Request) -> int:
    token: str | None = request.headers.get("Authorization")
    if token is None:
        raise InvalidAuthenticationError
    token = token.replace("Bearer ", "")
    uid = verify_token(token)
    if uid is None:
        raise InvalidAuthenticationError
    return uid


def get_authenticated_admin(request: Request) -> Admin:
    session = request.state.session
    uid = get_authenticated_user(request)

    if not is_user_admin(session, uid):
        raise InvalidAdminCredentialsError
    return get_admin(session, uid)


def get_authenticated_teacher(request: Request) -> Teacher:
    session = request.state.session
    uid = get_authenticated_user(request)

    if not is_user_teacher(session, uid):
        raise InvalidTeacherCredentialsError
    return get_teacher(session, uid)


def get_authenticated_student(request: Request) -> Student:
    session = request.state.session
    uid = get_authenticated_user(request)

    if not is_user_student(session, uid):
        raise InvalidStudentCredentialsError

    return get_student(session, uid)


def ensure_user_authorized_for_course(request: Request, course_id: int) -> None:
    session = request.state.session
    uid = get_authenticated_user(request)

    if not is_user_authorized_for_course(course_id, session, uid):
        raise NoAccessToDataError


def ensure_user_authorized_for_project(request: Request, project_id: int) -> None:
    session = request.state.session
    project = get_project(session, project_id)
    return ensure_user_authorized_for_course(request, project.course_id)


def ensure_student_authorized_for_course(request: Request, course_id: int) -> Student:
    session = request.state.session
    student = get_authenticated_student(request)

    courses_of_student = get_courses_of_student(session, student.id)
    if course_id not in [course.id for course in courses_of_student]:
        raise NoAccessToDataError
    return student


def ensure_teacher_authorized_for_course(request: Request, course_id: int) -> Teacher:
    session = request.state.session
    teacher = get_authenticated_teacher(request)

    courses_of_teacher = get_courses_of_teacher(session, teacher.id)
    if course_id not in [course.id for course in courses_of_teacher]:
        raise NoAccessToDataError
    return teacher


def ensure_student_authorized_for_project(request: Request, project_id: int) -> Student:
    session = request.state.session
    project = get_project(session, project_id)
    return ensure_student_authorized_for_course(request, project.course_id)


def ensure_teacher_authorized_for_project(request: Request, project_id: int) -> Teacher:
    session = request.state.session
    project = get_project(session, project_id)
    return ensure_teacher_authorized_for_course(request, project.course_id)


def ensure_student_authorized_for_group(request: Request, group_id: int) -> Student:
    session = request.state.session
    group = get_group(session, group_id)
    return ensure_student_authorized_for_project(request, group.project_id)


def ensure_teacher_authorized_for_group(request: Request, group_id: int) -> Teacher:
    session = request.state.session
    group = get_group(session, group_id)
    return ensure_teacher_authorized_for_project(request, group.project_id)


def ensure_user_authorized_for_group(request: Request, group_id: int) -> None:
    session = request.state.session
    group = get_group(session, group_id)
    ensure_user_authorized_for_project(request, group.project_id)


def ensure_student_in_group(request: Request, group_id: int) -> Student:
    session = request.state.session
    student = get_authenticated_student(request)

    if student not in get_students_of_group(session, group_id):
        raise NoAccessToDataError
    return student


def ensure_user_authorized_for_submission(request: Request, group_id: int) -> None:
    session = request.state.session
    uid = get_authenticated_user(request)

    group = get_group(session, group_id)
    if is_user_student(session, uid):
        student = get_student(session, uid)
        if student in get_students_of_group(session, group_id):
            return
    if is_user_teacher(session, uid) and get_project(session, group.project_id) in get_projects_of_teacher(
        session,
        uid,
    ):
        return
    raise NoAccessToDataError
