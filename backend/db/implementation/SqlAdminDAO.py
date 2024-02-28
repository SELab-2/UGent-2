from sqlalchemy.orm import Session

from db.extensions import engine
from db.implementation.SqlAbstractDAO import SqlAbstractDAO
from db.interface.AdminDAO import AdminDAO
from db.models.models import Admin
from domain.models.AdminDataclass import AdminDataclass


class SqlAdminDAO(AdminDAO, SqlAbstractDAO[Admin, AdminDataclass]):

    def create_admin(self, name: str, email: str) -> AdminDataclass:
        with Session(engine) as session:
            new_admin: Admin = Admin(name=name, email=email)
            session.add(new_admin)
            session.commit()
            return new_admin.to_domain_model()
