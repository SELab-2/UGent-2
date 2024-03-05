from fastapi import APIRouter, HTTPException, status

from db.errors.database_errors import ItemNotFoundError
from domain.logic.UserLogic import convert_user
from domain.models.APIUser import APIUser
from routes.db import get_dao_provider
from routes.login import ensure_admin_access, get_authenticated_user

users_router = APIRouter()


@users_router.get("/user")
def get_current_user() -> APIUser:
    user = get_authenticated_user()
    return convert_user(user, get_dao_provider())


@users_router.get("/users")
def get_users() -> list[APIUser]:
    ensure_admin_access()
    user_dao = get_dao_provider().get_user_dao()
    users = user_dao.get_all()
    return [convert_user(user, get_dao_provider()) for user in users]


@users_router.get("/users/{uid}")
def get_user(uid: int) -> APIUser:
    ensure_admin_access()
    user_dao = get_dao_provider().get_user_dao()
    try:
        user = user_dao.get(uid)
    except ItemNotFoundError as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
    return convert_user(user, get_dao_provider())
