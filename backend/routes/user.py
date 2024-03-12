from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from db.models.models import User
from db.sessions import get_session
from domain.logic.basic_operations import get, get_all
from domain.logic.role_enum import Role
from domain.logic.user import convert_user, modify_user_roles
from domain.models.APIUser import APIUser
from domain.models.UserDataclass import UserDataclass
from routes.dependencies.role_dependencies import get_authenticated_admin, get_authenticated_user

users_router = APIRouter()


@users_router.get("/user")
def get_current_user(
    session: Session = Depends(get_session),
    user_id: int = Depends(get_authenticated_user),
) -> APIUser:
    user: UserDataclass = get(session, User, user_id).to_domain_model()
    return convert_user(session, user)


@users_router.get("/users", dependencies=[Depends(get_authenticated_admin)])
def get_users(session: Session = Depends(get_session)) -> list[APIUser]:
    users: list[UserDataclass] = [user.to_domain_model() for user in get_all(session, User)]
    return [convert_user(session, user) for user in users]


@users_router.get("/users/{uid}", dependencies=[Depends(get_authenticated_admin)])
def get_user(uid: int, session: Session = Depends(get_session)) -> APIUser:
    user: UserDataclass = get(session, User, uid).to_domain_model()
    return convert_user(session, user)


@users_router.patch("/users/{uid}", dependencies=[Depends(get_authenticated_admin)])
def modify_user(uid: int, roles: list[Role], session: Session = Depends(get_session)) -> Response:
    modify_user_roles(session, uid, roles)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
