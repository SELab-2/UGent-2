from fastapi import APIRouter
from starlette.requests import Request

from controllers.authentication.role_dependencies import (
    ensure_teacher_authorized_for_subject,
    ensure_user_authorized_for_subject,
    get_authenticated_user,
)
from controllers.swagger_tags import Tags
from db.models import Project, ProjectInput, Student, Subject, Teacher
from domain.logic.project import create_project, get_projects_of_subject, validate_constraints
from domain.logic.subject import get_students_of_subject, get_subject, get_teachers_of_subject

subject_router = APIRouter()


@subject_router.get("/subjects/{subject_id}", tags=[Tags.SUBJECT], summary="Get a certain subject.")
def subject_get(request: Request, subject_id: int) -> Subject:
    session = request.state.session
    get_authenticated_user(request)
    return get_subject(session, subject_id)


@subject_router.get("/subjects/{subject_id}/projects", tags=[Tags.SUBJECT], summary="Get all projects of subject.")
def get_subject_projects(request: Request, subject_id: int) -> list[Project]:
    session = request.state.session
    ensure_user_authorized_for_subject(request, subject_id)
    return get_projects_of_subject(session, subject_id)


@subject_router.get("/subjects/{subject_id}/teachers", tags=[Tags.SUBJECT], summary="Get all teachers of subject.")
def get_subject_teachers(request: Request, subject_id: int) -> list[Teacher]:
    session = request.state.session
    ensure_user_authorized_for_subject(request, subject_id)
    return get_teachers_of_subject(session, subject_id)


@subject_router.get("/subjects/{subject_id}/students", tags=[Tags.SUBJECT], summary="Get all students of subject.")
def get_subject_students(request: Request, subject_id: int) -> list[Student]:
    session = request.state.session
    ensure_user_authorized_for_subject(request, subject_id)
    return get_students_of_subject(session, subject_id)


@subject_router.post("/subjects/{subject_id}/projects", tags=[Tags.PROJECT], summary="Create project in a course.")
def new_project(request: Request, subject_id: int, project: ProjectInput) -> Project:
    session = request.state.session
    ensure_teacher_authorized_for_subject(request, subject_id)
    if project.requirements:
        validate_constraints(project.requirements)
    return create_project(
        session,
        subject_id=subject_id,
        name=project.name,
        deadline=project.deadline,
        archived=project.archived,
        description=project.description,
        requirements=project.requirements,
        visible=project.visible,
        max_students=project.max_students,
    )
