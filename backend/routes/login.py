from fastapi import HTTPException, status

from domain.models.UserDataclass import UserDataclass
from routes.db import get_dao_provider


def get_authenticated_user() -> UserDataclass:
    return get_dao_provider().get_user_dao().get(1)  # Actually authenticate user


def is_user_admin() -> bool:
    user = get_authenticated_user()
    admin_dao = get_dao_provider().get_admin_dao()
    return admin_dao.is_user_admin(user.id)


def ensure_admin_access() -> None:
    if not is_user_admin():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
