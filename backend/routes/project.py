from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.project import get_project
from domain.models.ProjectDataclass import ProjectDataclass

project_router = APIRouter()


@project_router.get("/projects/{project_id}")
def get_subject_project(project_id: int, session: Session = Depends(get_session)) -> ProjectDataclass:
    return get_project(session, project_id)
