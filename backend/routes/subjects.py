from fastapi import APIRouter, HTTPException

from db.errors.database_errors import ItemNotFoundError
from domain.logic.SubjectLogic import is_user_authorized_for_subject
from domain.models.ProjectDataclass import ProjectDataclass
from domain.models.SubjectDataclass import SubjectDataclass
from routes.db import get_dao_provider
from routes.login import get_authenticated_user

subjects_router = APIRouter()


@subjects_router.get("/subjects")
def get_subjects(teacher: bool = False) -> list[SubjectDataclass]:
    user = get_authenticated_user()
    subject_dao = get_dao_provider().get_subject_dao()
    try:
        if teacher:
            return subject_dao.get_subjects_of_teacher(user.id)
        return subject_dao.get_subjects_of_student(user.id)
    except ItemNotFoundError as err:
        raise HTTPException(status_code=404) from err


@subjects_router.get("/subjects/{subject_id}")
def get_subject(subject_id: int) -> SubjectDataclass:
    subject_dao = get_dao_provider().get_subject_dao()
    try:
        return subject_dao.get(subject_id)
    except ItemNotFoundError as err:
        raise HTTPException(status_code=404) from err


@subjects_router.get("/subjects/{subject_id}/projects")
def get_subject_projects(subject_id: int) -> list[ProjectDataclass]:
    subject_dao = get_dao_provider().get_subject_dao()
    project_dao = get_dao_provider().get_project_dao()
    try:
        subject = subject_dao.get(subject_id)
        if not is_user_authorized_for_subject(subject, get_authenticated_user(), get_dao_provider()):
            raise HTTPException(status_code=403)
        return project_dao.get_projects_of_subject(subject_id)
    except ItemNotFoundError as err:
        raise HTTPException(status_code=404) from err
