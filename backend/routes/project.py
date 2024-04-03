from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.group import create_group, get_groups_of_project
from domain.logic.project import get_project, update_project
from domain.models.GroupDataclass import GroupDataclass
from domain.models.ProjectDataclass import ProjectDataclass, ProjectInput
from routes.dependencies.role_dependencies import (
    ensure_teacher_authorized_for_project,
    ensure_user_authorized_for_project,
)
from routes.tags.swagger_tags import Tags

project_router = APIRouter()


@project_router.get(
    "/projects/{project_id}",
    dependencies=[Depends(ensure_user_authorized_for_project)],
    tags=[Tags.PROJECT],
    summary="Get a certain project.",
)
def project_get(
    project_id: int,
    session: Session = Depends(get_session),
) -> ProjectDataclass:
    project: ProjectDataclass = get_project(session, project_id)
    return project


@project_router.get(
    "/projects/{project_id}/groups",
    dependencies=[Depends(ensure_user_authorized_for_project)],
    tags=[Tags.PROJECT],
    summary="Get all formed groups of a certain project.",
)
def project_get_groups(
    project_id: int,
    session: Session = Depends(get_session),
) -> list[GroupDataclass]:
    return get_groups_of_project(session, project_id)


@project_router.post(
    "/projects/{project_id}/groups",
    dependencies=[Depends(ensure_teacher_authorized_for_project)],
    tags=[Tags.PROJECT],
    summary="Create an empty group for a certain project.",
)
def project_create_group(
    project_id: int,
    session: Session = Depends(get_session),
) -> GroupDataclass:
    return create_group(session, project_id)


@project_router.patch(
    "/projects/{project_id}",
    dependencies=[Depends(ensure_teacher_authorized_for_project)],
    tags=[Tags.PROJECT],
    summary="Update a project.",
)
def patch_update_project(
    project_id: int,
    project: ProjectInput,
    session: Session = Depends(get_session),
) -> None:
    update_project(session, project_id, project)
