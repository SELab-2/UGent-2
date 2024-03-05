from db.interface.DAOProvider import DAOProvider
from domain.logic.SubjectLogic import is_user_authorized_for_subject
from domain.models.ProjectDataclass import ProjectDataclass
from domain.models.UserDataclass import UserDataclass


def is_user_authorized_for_project(project: ProjectDataclass, user: UserDataclass, dao_provider: DAOProvider) -> bool:
    subject_dao = dao_provider.get_subject_dao()
    subject = subject_dao.get(project.subject_id)
    return is_user_authorized_for_subject(subject, user, dao_provider)
