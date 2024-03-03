from db.implementation.SqlAdminDAO import SqlAdminDAO
from db.implementation.SqlGroupDAO import SqlGroupDAO
from db.implementation.SqlProjectDAO import SqlProjectDAO
from db.implementation.SqlStudentDAO import SqlStudentDAO
from db.implementation.SqlSubjectDAO import SqlSubjectDAO
from db.implementation.SqlSubmissionDAO import SqlSubmissionDAO
from db.implementation.SqlTeacherDAO import SqlTeacherDAO
from db.implementation.SqlUserDAO import SqlUserDAO
from db.interface.AdminDAO import AdminDAO
from db.interface.DAOProvider import DAOProvider
from db.interface.GroupDAO import GroupDAO
from db.interface.ProjectDAO import ProjectDAO
from db.interface.StudentDAO import StudentDAO
from db.interface.SubjectDAO import SubjectDAO
from db.interface.SubmissionDAO import SubmissionDAO
from db.interface.TeacherDAO import TeacherDAO
from db.interface.UserDAO import UserDAO


class SqlDAOProvider(DAOProvider):
    def get_admin_dao(self) -> AdminDAO:
        return SqlAdminDAO()

    def get_group_dao(self) -> GroupDAO:
        return SqlGroupDAO()

    def get_project_dao(self) -> ProjectDAO:
        return SqlProjectDAO()

    def get_student_dao(self) -> StudentDAO:
        return SqlStudentDAO()

    def get_subject_dao(self) -> SubjectDAO:
        return SqlSubjectDAO()

    def get_submission_dao(self) -> SubmissionDAO:
        return SqlSubmissionDAO()

    def get_teacher_dao(self) -> TeacherDAO:
        return SqlTeacherDAO()

    def get_user_dao(self) -> UserDAO:
        return SqlUserDAO()
