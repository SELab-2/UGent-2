from sqlalchemy import select

from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.AdminDAO import AdminDAO
from db.models.models import Admin
from domain.models.AdminDataclass import AdminDataclass


class SqlAdminDAO(AdminDAO):
    def get_admin(self, ident: int) -> AdminDataclass:
        admin: Admin | None = db.session.get(Admin, ident=ident)
        if not admin:
            msg = f"Admin with id {ident} not found"
            raise ItemNotFoundError(msg)
        return admin.to_domain_model()

    def get_all_admins(self) -> list[AdminDataclass]:
        admins: list[Admin] = db.session.scalars(select(Admin)).all()
        return [admin.to_domain_model() for admin in admins]

    def create_admin(self, name: str, email: str) -> None:
        new_admin: Admin = Admin(name=name, email=email)
        db.session.add(new_admin)
        db.session.commit()


