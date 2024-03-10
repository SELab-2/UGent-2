from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.project import get_projects_of_student
from domain.logic.subject import get_subjects_of_student
from domain.models.ProjectDataclass import ProjectDataclass
from domain.models.StudentDataclass import StudentDataclass
from domain.models.SubjectDataclass import SubjectDataclass
from routes.dependencies.role_dependencies import get_authenticated_student

student_router = APIRouter()


@student_router.get("/student/subjects")
def subjects_of_student_get(
    session: Session = Depends(get_session),
    student: StudentDataclass = Depends(get_authenticated_student),
) -> list[SubjectDataclass]:
    return get_subjects_of_student(session, student.id)


@student_router.get("/student/projects")
def projects_of_student_get(
    session: Session = Depends(get_session),
    student: StudentDataclass = Depends(get_authenticated_student),
) -> list[ProjectDataclass]:
    return get_projects_of_student(session, student.id)
