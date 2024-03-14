from sqlalchemy.orm import Session

from db.models.models import Admin, User
from domain.logic.basic_operations import get, get_all
from domain.models.AdminDataclass import AdminDataclass


def create_admin(session: Session, name: str, email: str) -> AdminDataclass:
    """
    This function is meant creating a new user that is an admin. It does not change the role of an existing user.
    """
    new_user: User = User(name=name, email=email)
    session.add(new_user)
    session.commit()
    new_admin: Admin = Admin(id=new_user.id)
    session.add(new_admin)
    session.commit()
    return new_admin.to_domain_model()


def get_admin(session: Session, admin_id: int) -> AdminDataclass:
    return get(session, Admin, admin_id).to_domain_model()


def get_all_admins(session: Session) -> list[AdminDataclass]:
    return [admin.to_domain_model() for admin in get_all(session, Admin)]


def is_user_admin(session: Session, user_id: int) -> bool:
    admin = session.get(Admin, user_id)
    return admin is not None
