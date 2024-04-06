from fastapi import APIRouter
from starlette.requests import Request

from db.models.models import Project, Subject
from domain.logic.project import get_projects_of_teacher
from domain.logic.subject import add_teacher_to_subject, create_subject, get_subjects_of_teacher
from domain.models.SubjectDataclass import SubjectInput
from routes.dependencies.role_dependencies import get_authenticated_teacher
from routes.tags.swagger_tags import Tags

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


@teacher_router.post("/teacher/subjects", tags=[Tags.SUBJECT], summary="Create a new subject.")
def create_subject_post(request: Request, subject: SubjectInput) -> Subject:
    session = request.state.session
    teacher = get_authenticated_teacher(request)

    new_subject = create_subject(session, name=subject.name)
    add_teacher_to_subject(session, teacher_id=teacher.id, subject_id=new_subject.id)
    return new_subject
