from sqlalchemy.orm import Session

from db.models.models import Admin
from domain.models.AdminDataclass import AdminDataclass


def create_admin(session: Session, name: str, email: str) -> AdminDataclass:
    new_admin: Admin = Admin(name=name, email=email)
    session.add(new_admin)
    session.commit()
    return new_admin.to_domain_model()


def is_user_admin(session: Session, user_id: int) -> bool:
    admin = session.get(Admin, user_id)
    return admin is not None
