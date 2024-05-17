from fastapi import APIRouter
from starlette.requests import Request

from controllers.authentication.role_dependencies import (
    ensure_student_authorized_for_group,
    ensure_student_authorized_for_project,
    ensure_teacher_authorized_for_group,
    ensure_user_authorized_for_group,
)
from controllers.swagger_tags import Tags
from db.models import Group, Student
from domain.logic.group import (
    add_student_to_group,
    get_group,
    get_group_for_student_and_project,
    get_students_of_group,
    remove_student_from_group,
)
from domain.logic.project import get_project, get_projects_of_student
from errors.logic_errors import UserNotEnrolledError

group_router = APIRouter(tags=[Tags.GROUP])


@group_router.post("/groups/{group_id}/join", summary="Join a certain group.")
def group_join(request: Request, group_id: int) -> None:
    session = request.state.session
    student = ensure_student_authorized_for_group(request, group_id)
    add_student_to_group(session, student.id, group_id)


@group_router.post("/groups/{group_id}/leave", summary="Leave a certain group.")
def group_leave(request: Request, group_id: int) -> None:
    session = request.state.session
    student = ensure_student_authorized_for_group(request, group_id)
    remove_student_from_group(session, student.id, group_id)


@group_router.get("/groups/{group_id}/members", summary="List group members.")
def list_group_members(request: Request, group_id: int) -> list[Student]:
    ensure_user_authorized_for_group(request, group_id)
    session = request.state.session
    return get_students_of_group(session, group_id)


@group_router.get("/projects/{project_id}/group", summary="Get your group for a project.")
def project_get_group(request: Request, project_id: int) -> Group | None:
    session = request.state.session
    student = ensure_student_authorized_for_project(request, project_id)
    return get_group_for_student_and_project(session, student.id, project_id)


@group_router.post("/groups/{group_id}/add", summary="Add a student to a group.")
def group_add(request: Request, group_id: int, uid: int) -> None:
    session = request.state.session
    ensure_teacher_authorized_for_group(request, group_id)
    group = get_group(session, group_id)
    project = get_project(session, group.project_id)
    if project not in get_projects_of_student(session, uid):
        raise UserNotEnrolledError
    add_student_to_group(session, uid, group_id)


@group_router.post("/groups/{group_id}/remove", summary="Remove a student from a group.")
def group_remove(request: Request, group_id: int, uid: int) -> None:
    session = request.state.session
    ensure_teacher_authorized_for_group(request, group_id)
    remove_student_from_group(session, uid, group_id)
