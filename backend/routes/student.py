from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.project import get_project, get_projects_of_subject
from domain.logic.subject import get_subject, get_subjects_of_student
from domain.models.ProjectDataclass import ProjectDataclass
from domain.models.StudentDataclass import StudentDataclass
from domain.models.SubjectDataclass import SubjectDataclass
from routes.dependencies.role_dependencies import get_authenticated_student, get_authenticated_student_for_subject

student_router = APIRouter()


@student_router.get("/student/subjects")
def subjects_of_student_get(
        session: Session = Depends(get_session),
        student: StudentDataclass = Depends(get_authenticated_student),
) -> list[SubjectDataclass]:
    return get_subjects_of_student(session, student.id)


@student_router.get("/student/subjects/{subject_id}", dependencies=[Depends(get_authenticated_student)])
def subject_get(subject_id: int, session: Session = Depends(get_session)) -> SubjectDataclass:
    return get_subject(session, subject_id)


@student_router.get("/student/subjects/{subject_id}/projects", dependencies=[Depends(get_authenticated_student)])
def get_subject_projects(subject_id: int, session: Session = Depends(get_session)) -> list[ProjectDataclass]:
    return get_projects_of_subject(session, subject_id)


@student_router.get("/student/subjects/{subject_id}/projects/{project_id}")
def get_subject_project(subject_id: int, project_id: int, session: Session = Depends(get_session)) -> ProjectDataclass:
    get_authenticated_student_for_subject(subject_id)
    return get_project(session, project_id)
