from fastapi import APIRouter
from starlette.requests import Request

from db.models.models import Group, Project
from domain.logic.group import create_group, get_groups_of_project
from domain.logic.project import get_project, update_project
from domain.models.ProjectDataclass import ProjectInput
from routes.dependencies.role_dependencies import (
    ensure_teacher_authorized_for_project,
    ensure_user_authorized_for_project,
)
from routes.tags.swagger_tags import Tags

project_router = APIRouter()


@project_router.get("/projects/{project_id}", tags=[Tags.PROJECT], summary="Get a certain project.")
def project_get(request: Request, project_id: int) -> Project:
    session = request.state.session
    ensure_user_authorized_for_project(request, project_id)
    project: Project = get_project(session, project_id)
    return project


@project_router.get("/projects/{project_id}/groups", tags=[Tags.PROJECT], summary="Get all groups of a project.")
def project_get_groups(request: Request, project_id: int) -> list[Group]:
    session = request.state.session
    ensure_user_authorized_for_project(request, project_id)
    return get_groups_of_project(session, project_id)


@project_router.post("/projects/{project_id}/groups", tags=[Tags.PROJECT], summary="Create a group for a project.")
def project_create_group(request: Request, project_id: int) -> Group:
    session = request.state.session
    ensure_teacher_authorized_for_project(request, project_id)
    return create_group(session, project_id)


@project_router.patch("/projects/{project_id}", tags=[Tags.PROJECT], summary="Update a project.")
def patch_update_project(request: Request, project_id: int, project: ProjectInput) -> None:
    session = request.state.session
    ensure_teacher_authorized_for_project(request, project_id)
    update_project(session, project_id, project)
