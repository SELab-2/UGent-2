from fastapi import APIRouter, HTTPException, status

from db.errors.database_errors import ItemNotFoundError
from domain.logic.ProjectLogic import is_user_authorized_for_project
from domain.models.GroupDataclass import GroupDataclass
from domain.models.ProjectDataclass import ProjectDataclass
from routes.db import get_dao_provider
from routes.login import get_authenticated_user

projects_router = APIRouter()


@projects_router.get("/projects")
def get_projects(teacher: bool = False) -> list[ProjectDataclass]:
    user = get_authenticated_user()
    project_dao = get_dao_provider().get_project_dao()
    subject_dao = get_dao_provider().get_subject_dao()
    try:
        if teacher:
            subjects = subject_dao.get_subjects_of_teacher(user.id)
        else:
            subjects = subject_dao.get_subjects_of_student(user.id)
        projects = []
        for i in subjects:
            projects += project_dao.get_projects_of_subject(i.id)
    except ItemNotFoundError as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
    return projects


def ensure_project_authorized(project: ProjectDataclass) -> None:
    user = get_authenticated_user()
    if not is_user_authorized_for_project(project, user, get_dao_provider()):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to access this project")


@projects_router.get("/projects/{project_id}")
def get_project(project_id: int) -> ProjectDataclass:
    project_dao = get_dao_provider().get_project_dao()
    try:
        project = project_dao.get(project_id)
    except ItemNotFoundError as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
    ensure_project_authorized(project)
    return project


@projects_router.get("/projects/{project_id}/groups")
def get_project_groups(project_id: int) -> list[GroupDataclass]:
    project_dao = get_dao_provider().get_project_dao()
    group_dao = get_dao_provider().get_group_dao()
    try:
        project = project_dao.get(project_id)
    except ItemNotFoundError as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
    ensure_project_authorized(project)
    return group_dao.get_groups_of_project(project.id)
