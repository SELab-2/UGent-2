from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.project import get_project
from domain.models.ProjectDataclass import ProjectDataclass
from routes.dependencies.role_dependencies import ensure_user_authorized_for_subject

project_router = APIRouter()


@project_router.get("/projects/{project_id}")
def get_subject_project(project_id: int, session: Session = Depends(get_session)) -> ProjectDataclass:
    project: ProjectDataclass = get_project(session, project_id)
    ensure_user_authorized_for_subject(project.subject_id)
    return project
