from sqlmodel import Session

from db.models import Admin, User
from domain.logic.basic_operations import get, get_all


def create_admin(session: Session, name: str, email: str) -> Admin:
    """
    This function is meant to create a new user that is an admin. It does not change the role of an existing user.
    """
    new_user: User = User(name=name, email=email)
    session.add(new_user)
    session.commit()
    new_admin: Admin = Admin(id=new_user.id)
    session.add(new_admin)
    session.commit()
    return new_admin


def get_admin(session: Session, admin_id: int) -> Admin:
    return get(session, Admin, admin_id)


def get_all_admins(session: Session) -> list[Admin]:
    return get_all(session, Admin)


def is_user_admin(session: Session, user_id: int) -> bool:
    admin = session.get(Admin, user_id)
    return admin is not None
