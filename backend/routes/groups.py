from fastapi import APIRouter, HTTPException, status

from db.errors.database_errors import ItemNotFoundError
from domain.logic.GroupLogic import is_user_authorized_for_group
from domain.models.GroupDataclass import GroupDataclass
from domain.models.StudentDataclass import StudentDataclass
from routes.db import get_dao_provider
from routes.login import get_authenticated_user

groups_router = APIRouter()


@groups_router.get("/groups")
def get_groups() -> list[GroupDataclass]:
    user = get_authenticated_user()
    group_dao = get_dao_provider().get_group_dao()
    try:
        groups = group_dao.get_groups_of_student(user.id)
    except ItemNotFoundError as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
    return groups


def ensure_group_authorized(group: GroupDataclass) -> None:
    user = get_authenticated_user()
    if not is_user_authorized_for_group(group, user, get_dao_provider()):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to access this group")


@groups_router.get("/groups/{group_id}")
def get_group(group_id: int) -> GroupDataclass:
    group_dao = get_dao_provider().get_group_dao()
    try:
        group = group_dao.get(group_id)
    except ItemNotFoundError as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
    ensure_group_authorized(group)
    return group


@groups_router.get("/groups/{group_id}/students")
def get_group_students(group_id: int) -> list[StudentDataclass]:
    group_dao = get_dao_provider().get_group_dao()
    try:
        group = group_dao.get(group_id)
    except ItemNotFoundError as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
    ensure_group_authorized(group)
    return group_dao.get_students_of_group(group.id)
