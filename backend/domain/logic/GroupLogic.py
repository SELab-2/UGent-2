from db.interface.DAOProvider import DAOProvider
from domain.logic.SubjectLogic import is_user_authorized_for_subject
from domain.models.GroupDataclass import GroupDataclass
from domain.models.UserDataclass import UserDataclass


def is_user_authorized_for_group(group: GroupDataclass, user: UserDataclass, dao_provider: DAOProvider) -> bool:
    subject_dao = dao_provider.get_subject_dao()
    project_dao = dao_provider.get_project_dao()
    project = project_dao.get(group.project_id)
    subject = subject_dao.get(project.subject_id)
    return is_user_authorized_for_subject(subject, user, dao_provider)
