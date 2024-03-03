from pydantic import BaseModel, EmailStr

from db.implementation.SqlAdminDAO import SqlAdminDAO
from db.implementation.SqlStudentDAO import SqlStudentDAO
from db.implementation.SqlTeacherDAO import SqlTeacherDAO
from domain.models.UserDataclass import UserDataclass


class APIUser(BaseModel):
    id: int
    name: str
    email: EmailStr
    roles: list[str]


def convert_user(user: UserDataclass) -> APIUser:
    result = APIUser(id=user.id, name=user.name, email=user.email, roles=[])
    teacher_dao = SqlTeacherDAO()
    admin_dao = SqlAdminDAO()
    student_dao = SqlStudentDAO()
    if teacher_dao.is_user_teacher(user.id):
        result.roles.append("teacher")
    if admin_dao.is_user_admin(user.id):
        result.roles.append("admin")
    if student_dao.is_user_student(user.id):
        result.roles.append("student")
    return result
