from fastapi import APIRouter, Depends
from starlette.requests import Request

from domain.logic.project import get_projects_of_student
from domain.logic.subject import add_student_to_subject, get_subjects_of_student
from domain.models.ProjectDataclass import ProjectDataclass
from domain.models.StudentDataclass import StudentDataclass
from domain.models.SubjectDataclass import SubjectDataclass
from routes.dependencies.role_dependencies import get_authenticated_student
from routes.tags.swagger_tags import Tags

student_router = APIRouter()


@student_router.get("/student/subjects", tags=[Tags.STUDENT], summary="Get all subjects of the student.")
def subjects_of_student_get(
    request: Request,
    student: StudentDataclass = Depends(get_authenticated_student),
) -> list[SubjectDataclass]:
    return get_subjects_of_student(request.state.session, student.id)


@student_router.get("/student/projects", tags=[Tags.STUDENT], summary="Get all projects of the student.")
def projects_of_student_get(
    request: Request,
    student: StudentDataclass = Depends(get_authenticated_student),
) -> list[ProjectDataclass]:
    return get_projects_of_student(request.state.session, student.id)


@student_router.post(
        "/student/subjects/{subject_id}/join",
        tags=[Tags.STUDENT],
        summary="Join a certain subject (for student).",
)
def student_subject_join(
    subject_id: int,
    request: Request,
    student: StudentDataclass = Depends(get_authenticated_student),
) -> None:
    add_student_to_subject(request.state.session, student.id, subject_id)
