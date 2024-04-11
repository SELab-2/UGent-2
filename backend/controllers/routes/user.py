from fastapi import APIRouter, Response, status
from starlette.requests import Request

from controllers.authentication.role_dependencies import get_authenticated_admin, get_authenticated_user
from controllers.swagger_tags import Tags
from db.models import User
from domain.logic.basic_operations import get, get_all
from domain.logic.role_enum import Role
from domain.logic.user import get_user, modify_language, modify_user_roles

users_router = APIRouter()


@users_router.get("/user", tags=[Tags.USER], summary="Get the current user (and its roles).")
def get_current_user(request: Request) -> User:
    session = request.state.session
    uid = get_authenticated_user(request)
    return get_user(session, uid)


@users_router.patch("/user", tags=[Tags.USER], summary="Modify the language of the user.")
def modify_current_user(request: Request, language: str) -> Response:
    session = request.state.session
    uid = get_authenticated_user(request)

    modify_language(session, uid, language)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@users_router.get("/users", tags=[Tags.USER], summary="Get all users.")
def get_users(request: Request) -> list[User]:
    session = request.state.session
    get_authenticated_admin(request)

    return get_all(session, User)


@users_router.get("/users/{uid}", tags=[Tags.USER], summary="Get a certain user.")
def admin_get_user(request: Request, uid: int) -> User:
    session = request.state.session
    get_authenticated_admin(request)

    return get(session, User, uid)


@users_router.patch("/users/{uid}", tags=[Tags.USER], summary="Modify the roles of a certain user.")
def modify_user(request: Request, uid: int, roles: list[Role]) -> Response:
    session = request.state.session
    get_authenticated_admin(request)

    modify_user_roles(session, uid, roles)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
