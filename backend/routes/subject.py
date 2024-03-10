from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.project import create_project, get_projects_of_subject
from domain.logic.subject import get_subject
from domain.models.ProjectDataclass import ProjectDataclass, ProjectInput
from domain.models.SubjectDataclass import SubjectDataclass
from routes.dependencies.role_dependencies import (
    ensure_user_authorized_for_subject,
    get_authenticated_teacher_for_subject,
    get_authenticated_user,
)

subject_router = APIRouter()


@subject_router.get("/subjects/{subject_id}", dependencies=[Depends(get_authenticated_user)])
def subject_get(subject_id: int, session: Session = Depends(get_session)) -> SubjectDataclass:
    return get_subject(session, subject_id)


@subject_router.get("/subjects/{subject_id}/projects", dependencies=[Depends(ensure_user_authorized_for_subject)])
def get_subject_projects(subject_id: int, session: Session = Depends(get_session)) -> list[ProjectDataclass]:
    return get_projects_of_subject(session, subject_id)


@subject_router.post("/subjects/{subject_id}/projects", dependencies=[Depends(get_authenticated_teacher_for_subject)])
def new_project(
    subject_id: int,
    project: ProjectInput,
    session: Session = Depends(get_session),
) -> ProjectDataclass:
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
