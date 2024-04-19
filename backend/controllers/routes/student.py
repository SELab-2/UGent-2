from fastapi import APIRouter
from starlette.requests import Request

from controllers.authentication.role_dependencies import get_authenticated_student
from controllers.swagger_tags import Tags
from db.models import Course, Project
from domain.logic.course import add_student_to_course, get_courses_of_student, remove_student_from_course
from domain.logic.project import get_projects_of_student

student_router = APIRouter(tags=[Tags.STUDENT])


@student_router.get("/student/courses", summary="Get all courses of the student.")
def courses_of_student_get(request: Request) -> list[Course]:
    student = get_authenticated_student(request)
    return get_courses_of_student(request.state.session, student.id)


@student_router.get("/student/projects", summary="Get all projects of the student.")
def projects_of_student_get(request: Request) -> list[Project]:
    student = get_authenticated_student(request)
    return get_projects_of_student(request.state.session, student.id)


@student_router.post("/student/courses/{course_id}/join", summary="Join a course.")
def student_course_join(request: Request, course_id: int) -> None:
    student = get_authenticated_student(request)
    add_student_to_course(request.state.session, student.id, course_id)


@student_router.post("/student/courses/{course_id}/leave", summary="Leave a course.")
def student_course_leave(request: Request, course_id: int) -> None:
    student = get_authenticated_student(request)
    remove_student_from_course(request.state.session, student.id, course_id)
