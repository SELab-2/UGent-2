from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.group import add_student_to_group, get_students_of_group, remove_student_from_group
from domain.models.StudentDataclass import StudentDataclass
from routes.dependencies.role_dependencies import ensure_student_authorized_for_group, ensure_user_authorized_for_group
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
