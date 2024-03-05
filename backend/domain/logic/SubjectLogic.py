from db.interface.DAOProvider import DAOProvider
from domain.models.SubjectDataclass import SubjectDataclass
from domain.models.UserDataclass import UserDataclass


def is_user_authorized_for_subject(subject: SubjectDataclass, user: UserDataclass, dao_provider: DAOProvider) -> bool:
    teacher_dao = dao_provider.get_teacher_dao()
    student_dao = dao_provider.get_student_dao()
    subject_dao = dao_provider.get_subject_dao()

    if teacher_dao.is_user_teacher(user.id) and subject in subject_dao.get_subjects_of_teacher(user.id):
        return True

    if student_dao.is_user_student(user.id) and subject in subject_dao.get_subjects_of_student(user.id):
        return True

    return False
