from fastapi import APIRouter, Depends, HTTPException

from db.errors.database_errors import ItemNotFoundError
from db.implementation.SqlUserDAO import SqlUserDAO
from domain.models.APIUser import APIUser, convert_user
from domain.models.UserDataclass import UserDataclass
from routes.login import get_authenticated_user, is_user_admin

users_router = APIRouter()


@users_router.get("/user")
def get_current_user(user: UserDataclass = Depends(get_authenticated_user)) -> APIUser:
    return convert_user(user)


@users_router.get("/users")
def get_users(admin: bool = Depends(is_user_admin)) -> list[APIUser]:
    if not admin:
        raise HTTPException(status_code=403)
    users = SqlUserDAO().get_all()
    return [convert_user(user) for user in users]


@users_router.get("/users/{uid}")
def get_user(uid: int, admin: bool = Depends(is_user_admin)) -> APIUser:
    if not admin:
        raise HTTPException(status_code=403)
    try:
        user = SqlUserDAO().get(uid)
    except ItemNotFoundError as err:
        raise HTTPException(status_code=404) from err
    return convert_user(user)
