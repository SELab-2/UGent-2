from fastapi import APIRouter, BackgroundTasks
from starlette.requests import Request

from controllers.authentication.role_dependencies import (
    ensure_teacher_authorized_for_course,
    ensure_user_authorized_for_course,
    get_authenticated_user,
)
from controllers.swagger_tags import Tags
from db.models import Course, CourseInput, Project, ProjectInput, Student, Teacher
from domain.logic.course import get_course, get_students_of_course, get_teachers_of_course, update_course
from domain.logic.docker import add_image_id
from domain.logic.project import create_project, get_projects_of_course, validate_constraints

course_router = APIRouter(tags=[Tags.COURSE])


@course_router.get("/courses/{course_id}", summary="Get a certain course.")
def course_get(request: Request, course_id: int) -> Course:
    session = request.state.session
    get_authenticated_user(request)
    return get_course(session, course_id)


@course_router.get("/courses/{course_id}/projects", summary="Get all projects of course.")
def get_course_projects(request: Request, course_id: int) -> list[Project]:
    session = request.state.session
    ensure_user_authorized_for_course(request, course_id)
    return get_projects_of_course(session, course_id)


@course_router.get("/courses/{course_id}/teachers", summary="Get all teachers of course.")
def get_course_teachers(request: Request, course_id: int) -> list[Teacher]:
    session = request.state.session
    ensure_user_authorized_for_course(request, course_id)
    return get_teachers_of_course(session, course_id)


@course_router.get("/courses/{course_id}/students", summary="Get all students of course.")
def get_course_students(request: Request, course_id: int) -> list[Student]:
    session = request.state.session
    ensure_user_authorized_for_course(request, course_id)
    return get_students_of_course(session, course_id)


@course_router.post("/courses/{course_id}/projects", summary="Create project in a course.")
def new_project(request: Request, course_id: int, project: ProjectInput, tasks: BackgroundTasks) -> Project:
    session = request.state.session
    ensure_teacher_authorized_for_course(request, course_id)
    if project.requirements:
        validate_constraints(project.requirements)
    project_db = create_project(
        session,
        course_id=course_id,
        name=project.name,
        deadline=project.deadline,
        archived=project.archived,
        description=project.description,
        requirements=project.requirements,
        visible=project.visible,
        max_students=project.max_students,
        dockerfile=project.dockerfile,
    )
    if project_db.dockerfile != "":
        tasks.add_task(add_image_id, project_db.id)
    return project_db


@course_router.put("/courses/{course_id}", summary="Update a course")
def put_update_course(request: Request, course_id: int, course: CourseInput) -> None:
    session = request.state.session
    ensure_teacher_authorized_for_course(request, course_id)
    update_course(session, course_id, course)
