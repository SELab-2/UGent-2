from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.AdminDAO import AdminDAO
from db.models.models import Admin, User
from domain.models.models import AdminDataclass


class SqlAdminDAO(AdminDAO):
    def get_admin(self, ident: int) -> AdminDataclass:
        admin: Admin = db.session.get(Admin, ident=ident)
        if not admin:
            raise ItemNotFoundError("AdminDataclass with given id not found")
        return admin.to_domain_model()

    def get_all_admins(self) -> list[AdminDataclass]:
        admins: list[Admin] = db.session.get(Admin).all()
        return [admin.to_domain_model() for admin in admins]

    def create_admin(self, name: str, email: str):
        new_admin: Admin = Admin(name=name, email=email)
        db.session.add(new_admin)
        db.session.commit()


