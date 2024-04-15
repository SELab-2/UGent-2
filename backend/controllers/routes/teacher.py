from fastapi import APIRouter
from starlette.requests import Request

from controllers.authentication.role_dependencies import (
    ensure_teacher_authorized_for_subject,
    get_authenticated_teacher,
)
from controllers.swagger_tags import Tags
from db.models import Project, Subject, SubjectInput
from domain.logic.errors import NotATeacherError
from domain.logic.project import get_projects_of_teacher
from domain.logic.subject import (
    add_teacher_to_subject,
    create_subject,
    get_subjects_of_teacher,
    remove_teacher_from_subject,
)
from domain.logic.teacher import is_user_teacher

teacher_router = APIRouter()


@teacher_router.get("/teacher/subjects", tags=[Tags.TEACHER], summary="Get all subjects the teacher manages.")
def subjects_of_teacher_get(request: Request) -> list[Subject]:
    session = request.state.session
    teacher = get_authenticated_teacher(request)
    return get_subjects_of_teacher(session, teacher.id)


@teacher_router.get("/teacher/projects", tags=[Tags.TEACHER], summary="Get all projects of the teacher.")
def projects_of_teacher_get(request: Request) -> list[Project]:
    session = request.state.session
    teacher = get_authenticated_teacher(request)
    return get_projects_of_teacher(session, teacher.id)


@teacher_router.post("/teacher/subjects", tags=[Tags.TEACHER], summary="Create a new subject.")
def create_subject_post(request: Request, subject: SubjectInput) -> Subject:
    session = request.state.session
    teacher = get_authenticated_teacher(request)

    new_subject = create_subject(session, name=subject.name)
    add_teacher_to_subject(session, teacher_id=teacher.id, subject_id=new_subject.id)
    return new_subject


@teacher_router.post("/teacher/subjects/{subject_id}/leave", tags=[Tags.TEACHER], summary="Leave a subject.")
def teacher_subject_leave(request: Request, subject_id: int) -> None:
    teacher = ensure_teacher_authorized_for_subject(request, subject_id)
    remove_teacher_from_subject(request.state.session, teacher.id, subject_id)


@teacher_router.post("/teacher/subjects/{subject_id}/add", tags=[Tags.TEACHER], summary="Add a teacher to a subject.")
def teacher_subject_add(request: Request, subject_id: int, teacher_id: int) -> None:
    ensure_teacher_authorized_for_subject(request, subject_id)
    if not is_user_teacher(request.state.session, teacher_id):
        raise NotATeacherError
    add_teacher_to_subject(request.state.session, teacher_id, subject_id)
