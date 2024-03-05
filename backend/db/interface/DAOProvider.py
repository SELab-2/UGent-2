from abc import ABC, abstractmethod

from db.interface.AdminDAO import AdminDAO
from db.interface.GroupDAO import GroupDAO
from db.interface.ProjectDAO import ProjectDAO
from db.interface.StudentDAO import StudentDAO
from db.interface.SubjectDAO import SubjectDAO
from db.interface.SubmissionDAO import SubmissionDAO
from db.interface.TeacherDAO import TeacherDAO
from db.interface.UserDAO import UserDAO


class DAOProvider(ABC):
    @abstractmethod
    def get_admin_dao(self) -> AdminDAO:
        raise NotImplementedError

    @abstractmethod
    def get_group_dao(self) -> GroupDAO:
        raise NotImplementedError

    @abstractmethod
    def get_project_dao(self) -> ProjectDAO:
        raise NotImplementedError

    @abstractmethod
    def get_student_dao(self) -> StudentDAO:
        raise NotImplementedError

    @abstractmethod
    def get_subject_dao(self) -> SubjectDAO:
        raise NotImplementedError

    @abstractmethod
    def get_submission_dao(self) -> SubmissionDAO:
        raise NotImplementedError

    @abstractmethod
    def get_teacher_dao(self) -> TeacherDAO:
        raise NotImplementedError

    @abstractmethod
    def get_user_dao(self) -> UserDAO:
        raise NotImplementedError
