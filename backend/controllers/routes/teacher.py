from fastapi import APIRouter
from starlette.requests import Request

from controllers.authentication.role_dependencies import (
    ensure_teacher_authorized_for_course,
    get_authenticated_teacher,
)
from controllers.swagger_tags import Tags
from db.models import Course, CourseInput, Project
from domain.logic.course import (
    add_teacher_to_course,
    create_course,
    get_courses_of_teacher,
    remove_teacher_from_course,
)
from domain.logic.project import get_projects_of_teacher
from domain.logic.teacher import is_user_teacher
from errors.logic_errors import NotATeacherError

teacher_router = APIRouter(tags=[Tags.TEACHER])


@teacher_router.get("/teacher/courses", summary="Get all courses the teacher manages.")
def courses_of_teacher_get(request: Request) -> list[Course]:
    session = request.state.session
    teacher = get_authenticated_teacher(request)
    return get_courses_of_teacher(session, teacher.id)


@teacher_router.get("/teacher/projects", summary="Get all projects of the teacher.")
def projects_of_teacher_get(request: Request) -> list[Project]:
    session = request.state.session
    teacher = get_authenticated_teacher(request)
    return get_projects_of_teacher(session, teacher.id)


@teacher_router.post("/teacher/courses", summary="Create a new course.")
def create_course_post(request: Request, course: CourseInput) -> Course:
    session = request.state.session
    teacher = get_authenticated_teacher(request)

    new_course = create_course(session, name=course.name)
    add_teacher_to_course(session, teacher_id=teacher.id, course_id=new_course.id)
    return new_course


@teacher_router.post("/teacher/courses/{course_id}/leave", summary="Leave a course.")
def teacher_course_leave(request: Request, course_id: int) -> None:
    teacher = ensure_teacher_authorized_for_course(request, course_id)
    remove_teacher_from_course(request.state.session, teacher.id, course_id)


@teacher_router.post("/teacher/courses/{course_id}/add", summary="Add a teacher to a course.")
def teacher_course_add(request: Request, course_id: int, teacher_id: int) -> None:
    ensure_teacher_authorized_for_course(request, course_id)
    if not is_user_teacher(request.state.session, teacher_id):
        raise NotATeacherError
    add_teacher_to_course(request.state.session, teacher_id, course_id)
