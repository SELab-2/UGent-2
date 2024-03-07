from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.project import get_projects_of_subject
from domain.logic.subject import get_subject
from domain.models.ProjectDataclass import ProjectDataclass
from domain.models.SubjectDataclass import SubjectDataclass
from routes.dependencies.role_dependencies import (
    get_authenticated_user,
    is_user_authorized_for_subject,
)

subject_router = APIRouter()


@subject_router.get("/subjects/{subject_id}", dependencies=[Depends(get_authenticated_user)])
def subject_get(subject_id: int, session: Session = Depends(get_session)) -> SubjectDataclass:
    return get_subject(session, subject_id)


@subject_router.get("/subjects/{subject_id}/projects", dependencies=[Depends(is_user_authorized_for_subject)])
def get_subject_projects(subject_id: int, session: Session = Depends(get_session)) -> list[ProjectDataclass]:
    return get_projects_of_subject(session, subject_id)
