from db.interface.DAOProvider import DAOProvider
from domain.models.APIUser import APIUser
from domain.models.UserDataclass import UserDataclass


def convert_user(user: UserDataclass, dao_provider: DAOProvider) -> APIUser:
    api_user = APIUser(id=user.id, name=user.name, email=user.email, roles=[])

    if dao_provider.get_teacher_dao().is_user_teacher(user.id):
        api_user.roles.append("teacher")

    if dao_provider.get_admin_dao().is_user_admin(user.id):
        api_user.roles.append("admin")

    if dao_provider.get_student_dao().is_user_student(user.id):
        api_user.roles.append("student")

    return api_user
