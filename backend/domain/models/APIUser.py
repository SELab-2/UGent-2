from pydantic import BaseModel, EmailStr

from db.interface.DAOProvider import DAOProvider
from domain.models.UserDataclass import UserDataclass


class APIUser(BaseModel):
    id: int
    name: str
    email: EmailStr
    roles: list[str]


def convert_user(user: UserDataclass, dao_provider: DAOProvider) -> APIUser:
    result = APIUser(id=user.id, name=user.name, email=user.email, roles=[])
    if dao_provider.get_teacher_dao().is_user_teacher(user.id):
        result.roles.append("teacher")
    if dao_provider.get_admin_dao().is_user_admin(user.id):
        result.roles.append("admin")
    if dao_provider.get_student_dao().is_user_student(user.id):
        result.roles.append("student")
    return result
