from fastapi import APIRouter, HTTPException, status

from db.errors.database_errors import ItemNotFoundError
from domain.logic.SubjectLogic import is_user_authorized_for_subject
from domain.models.ProjectDataclass import ProjectDataclass
from routes.db import get_dao_provider
from routes.login import get_authenticated_user

projects_router = APIRouter()


@projects_router.get("/projects")
def get_subjects(teacher: bool = False) -> list[ProjectDataclass]:
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND) from err
    return projects


@projects_router.get("/projects/{project_id}")
def get_project(project_id: int) -> ProjectDataclass:
    project_dao = get_dao_provider().get_project_dao()
    subject_dao = get_dao_provider().get_subject_dao()
    user = get_authenticated_user()
    try:
        project = project_dao.get(project_id)
    except ItemNotFoundError as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND) from err
    subject = subject_dao.get(project.subject_id)
    if not is_user_authorized_for_subject(subject, user, get_dao_provider()):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    return project
