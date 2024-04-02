from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.sessions import get_session
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
def group_join(
    group_id: int,
    student: StudentDataclass = Depends(ensure_student_authorized_for_group),
    session: Session = Depends(get_session),
) -> None:
    add_student_to_group(session, student.id, group_id)


@group_router.post("/groups/{group_id}/leave", tags=[Tags.GROUP], summary="Leave a certain group.")
def group_leave(
    group_id: int,
    student: StudentDataclass = Depends(ensure_student_authorized_for_group),
    session: Session = Depends(get_session),
) -> None:
    remove_student_from_group(session, student.id, group_id)


@group_router.get(
    "/groups/{group_id}/members",
    tags=[Tags.GROUP],
    summary="List group members.",
    dependencies=[Depends(ensure_user_authorized_for_group)],
)
def list_group_members(
    group_id: int,
    session: Session = Depends(get_session),
) -> list[StudentDataclass]:
    return get_students_of_group(session, group_id)


@group_router.get(
    "/projects/{project_id}/group",
    tags=[Tags.GROUP],
    summary="Get your group for a project.",
)
def project_get_group(
    project_id: int,
    session: Session = Depends(get_session),
    student: StudentDataclass = Depends(ensure_student_authorized_for_project),
) -> GroupDataclass | None:
    return get_group_for_student_and_project(session, student.id, project_id)
