from fastapi import APIRouter, Response, status
from starlette.requests import Request

from db.models.models import User
from domain.logic.basic_operations import get, get_all
from domain.logic.role_enum import Role
from domain.logic.user import convert_user, get_user, modify_language, modify_user_roles
from domain.models.APIUser import APIUser
from routes.dependencies.role_dependencies import get_authenticated_admin, get_authenticated_user
from routes.tags.swagger_tags import Tags

users_router = APIRouter()


@users_router.get("/user", tags=[Tags.USER], summary="Get the current user (and its roles).")
def get_current_user(request: Request) -> APIUser:
    session = request.state.session
    uid = get_authenticated_user(request)
    return convert_user(session, get_user(session, uid))


@users_router.patch("/user", tags=[Tags.USER], summary="Modify the language of the user.")
def modify_current_user(request: Request, language: str) -> Response:
    session = request.state.session
    uid = get_authenticated_user(request)

    modify_language(session, uid, language)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@users_router.get("/users", tags=[Tags.USER], summary="Get all users.")
def get_users(request: Request) -> list[APIUser]:
    session = request.state.session
    get_authenticated_admin(request)

    users: list[User] = [user.to_domain_model() for user in get_all(session, User)]
    return [convert_user(session, user) for user in users]


@users_router.get("/users/{uid}", tags=[Tags.USER], summary="Get a certain user.")
def admin_get_user(request: Request, uid: int) -> APIUser:
    session = request.state.session
    get_authenticated_admin(request)

    user: User = get(session, User, uid).to_domain_model()
    return convert_user(session, user)


@users_router.patch("/users/{uid}", tags=[Tags.USER], summary="Modify the roles of a certain user.")
def modify_user(request: Request, uid: int, roles: list[Role]) -> Response:
    session = request.state.session
    get_authenticated_admin(request)

    modify_user_roles(session, uid, roles)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
