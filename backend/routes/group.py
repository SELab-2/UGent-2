from fastapi import APIRouter
from starlette.requests import Request

from domain.logic.group import (
    add_student_to_group,
    get_group_for_student_and_project,
    get_students_of_group,
    remove_student_from_group,
)
from domain.models.GroupDataclass import GroupDataclass
from domain.models.StudentDataclass import StudentDataclass
from routes.dependencies.role_dependencies import (
    ensure_student_authorized_for_group,
    ensure_student_authorized_for_project,
    ensure_user_authorized_for_group,
)
from routes.tags.swagger_tags import Tags

group_router = APIRouter()


@group_router.post("/groups/{group_id}/join", tags=[Tags.GROUP], summary="Join a certain group.")
def group_join(request: Request, group_id: int) -> None:
    session = request.state.session
    student = ensure_student_authorized_for_group(group_id)
    add_student_to_group(session, student.id, group_id)


@group_router.post("/groups/{group_id}/leave", tags=[Tags.GROUP], summary="Leave a certain group.")
def group_leave(request: Request, group_id: int) -> None:
    session = request.state.session
    student = ensure_student_authorized_for_group(group_id)
    remove_student_from_group(session, student.id, group_id)


@group_router.get("/groups/{group_id}/members", tags=[Tags.GROUP], summary="List group members.")
def list_group_members(request: Request, group_id: int) -> list[StudentDataclass]:
    ensure_user_authorized_for_group(group_id)
    session = request.state.session
    return get_students_of_group(session, group_id)


@group_router.get("/projects/{project_id}/group", tags=[Tags.GROUP], summary="Get your group for a project.")
def project_get_group(request: Request, project_id: int) -> GroupDataclass | None:
    session = request.state.session
    student = ensure_student_authorized_for_project(project_id)
    return get_group_for_student_and_project(session, student.id, project_id)
