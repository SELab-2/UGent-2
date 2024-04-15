from fastapi import APIRouter
from starlette.requests import Request

from controllers.authentication.role_dependencies import get_authenticated_student
from controllers.swagger_tags import Tags
from db.models import Project, Subject
from domain.logic.project import get_projects_of_student
from domain.logic.subject import add_student_to_subject, get_subjects_of_student, remove_student_from_subject

student_router = APIRouter(tags=[Tags.STUDENT])


@student_router.get("/student/subjects", summary="Get all subjects of the student.")
def subjects_of_student_get(request: Request) -> list[Subject]:
    student = get_authenticated_student(request)
    return get_subjects_of_student(request.state.session, student.id)


@student_router.get("/student/projects", summary="Get all projects of the student.")
def projects_of_student_get(request: Request) -> list[Project]:
    student = get_authenticated_student(request)
    return get_projects_of_student(request.state.session, student.id)


@student_router.post("/student/subjects/{subject_id}/join", summary="Join a subject.")
def student_subject_join(request: Request, subject_id: int) -> None:
    student = get_authenticated_student(request)
    add_student_to_subject(request.state.session, student.id, subject_id)


@student_router.post("/student/subjects/{subject_id}/leave", summary="Leave a subject.")
def student_subject_leave(request: Request, subject_id: int) -> None:
    student = get_authenticated_student(request)
    remove_student_from_subject(request.state.session, student.id, subject_id)
