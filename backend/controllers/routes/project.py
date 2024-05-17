from fastapi import APIRouter, BackgroundTasks, Response
from starlette.requests import Request

from controllers.authentication.role_dependencies import (
    ensure_teacher_authorized_for_project,
    ensure_user_authorized_for_project,
)
from controllers.swagger_tags import Tags
from db.models import Group, Project, ProjectInput, ProjectStatistics
from domain.logic.docker import add_image_id
from domain.logic.group import create_group, get_groups_of_project, get_statistics_of_project
from domain.logic.project import get_project, update_project, validate_constraints
from domain.logic.submission import zip_all_submissions

project_router = APIRouter(tags=[Tags.PROJECT])


@project_router.get("/projects/{project_id}", summary="Get a certain project.")
def project_get(request: Request, project_id: int) -> Project:
    session = request.state.session
    ensure_user_authorized_for_project(request, project_id)
    project: Project = get_project(session, project_id)
    return project


@project_router.get("/projects/{project_id}/groups", summary="Get all groups of a project.")
def project_get_groups(request: Request, project_id: int) -> list[Group]:
    session = request.state.session
    ensure_user_authorized_for_project(request, project_id)
    return get_groups_of_project(session, project_id)


@project_router.get("/projects/{project_id}/statistics", summary="Get statistics about a project")
def project_get_statistics(request: Request, project_id: int) -> ProjectStatistics:
    session = request.state.session
    ensure_user_authorized_for_project(request, project_id)
    return get_statistics_of_project(session, project_id)


@project_router.post("/projects/{project_id}/groups", summary="Create a group for a project.")
def project_create_group(request: Request, project_id: int) -> Group:
    session = request.state.session
    ensure_teacher_authorized_for_project(request, project_id)
    return create_group(session, project_id)


@project_router.put("/projects/{project_id}", summary="Update a project.")
def put_update_project(request: Request, project_id: int, project: ProjectInput, tasks: BackgroundTasks) -> None:
    session = request.state.session
    ensure_teacher_authorized_for_project(request, project_id)
    if project.requirements:
        validate_constraints(project.requirements)
    update_project(session, project_id, project)
    if project.dockerfile != "":
        tasks.add_task(add_image_id, project_id)


@project_router.get("/projects/{project_id}/submissions", summary="Download all submissions")
def download_all_submissions(request: Request, project_id: int) -> Response:
    session = request.state.session
    ensure_teacher_authorized_for_project(request, project_id)
    zip_content = zip_all_submissions(session, project_id)
    return Response(zip_content, media_type="application/zip")
