from datetime import datetime

from app import app
from db.extensions import db
from db.implementation.SqlAdminDAO import SqlAdminDAO
from db.implementation.SqlGroupDAO import SqlGroupDAO
from db.implementation.SqlProjectDAO import SqlProjectDAO
from db.implementation.SqlStudentDAO import SqlStudentDAO
from db.implementation.SqlSubjectDAO import SqlSubjectDAO
from db.implementation.SqlSubmissionDAO import SqlSubmissionDAO
from db.implementation.SqlTeacherDAO import SqlTeacherDAO
from db.implementation.SqlUserDAO import SqlUserDAO
from db.interface.AdminDAO import AdminDAO
from db.interface.GroupDAO import GroupDAO
from db.interface.ProjectDAO import ProjectDAO
from db.interface.StudentDAO import StudentDAO
from db.interface.SubjectDAO import SubjectDAO
from db.interface.SubmissionDAO import SubmissionDAO
from db.interface.TeacherDAO import TeacherDAO
from db.interface.UserDAO import UserDAO
from domain.models.models import GroupDataclass, ProjectDataclass, SubjectDataclass, SubmissionDataclass, UserDataclass

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        teacher_dao: TeacherDAO = SqlTeacherDAO()
        subject_dao: SubjectDAO = SqlSubjectDAO()
        user_dao: UserDAO = SqlUserDAO()
        admin_dao: AdminDAO = SqlAdminDAO()
        student_dao: StudentDAO = SqlStudentDAO()
        project_dao: ProjectDAO = SqlProjectDAO()
        group_dao: GroupDAO = SqlGroupDAO()
        submission_dao: SubmissionDAO = SqlSubmissionDAO()

        # Maak nieuwe user aan.
        Gunnar = UserDataclass(name="Gunnar Brinkamann", email="gunnartjeDeLeerkracht@gmail.com")
        Alberic = UserDataclass(name="Alberic Loos", email="albericLoos@lala.com")
        Bob = UserDataclass(name="Bob", email="bob@lala.com")
        Rien = UserDataclass(name="Rien", email="rientje@gmail.com")

        # voeg users toe aan de databank
        user_dao.create_user(Gunnar)
        user_dao.create_user(Alberic)
        user_dao.create_user(Bob)
        user_dao.create_user(Rien)

        # voeg admin toe aan de databank
        admin_dao.create_admin(Gunnar.id)

        # voeg teacher toe aan de databank
        teacher_dao.create_teacher(Gunnar.id)
        teacher_dao.create_teacher(Rien.id)

        # voeg student toe aan de databank
        student_dao.create_student(Alberic.id)
        student_dao.create_student(Bob.id)

        # maak subjects aan
        AD2 = SubjectDataclass(name="AD2")
        AD3 = SubjectDataclass(name="AD3")

        # maak project aan
        AD2_project = ProjectDataclass(name="AD2_project",
                                       subject_id=AD2.id,
                                       archived=False,
                                       deadline=datetime(2024, 3, 1, 12, 0, 0),
                                       max_students=5,
                                       visible=True,
                                       requirements="lala")

        # maak een groep aan
        Group_1_AD2 = GroupDataclass(project_id=AD2_project.id)
        Group_2_AD2 = GroupDataclass(project_id=AD2_project.id)

        # maak een submission aan
        AD2_project_submission1 = SubmissionDataclass(date_time=datetime(2024, 3, 1, 12, 0, 0),
                                                     group_id=Group_1_AD2.id,
                                                     message="lalalalalalalalalalalal",
                                                     state=0,
                                                     student_id=Alberic.id)

        AD2_project_submission2 = SubmissionDataclass(date_time=datetime(2024, 3, 1, 12, 0, 0),
                                                      group_id=Group_1_AD2.id,
                                                      message="lalalalalalalalalalalal",
                                                      state=0,
                                                      student_id=Bob.id)

        # voeg subjects toe aan de databank
        subject_dao.create_subject(AD2, Gunnar.id)
        subject_dao.create_subject(AD3, Gunnar.id)

        # laat student vak volgen
        subject_dao.add_subject_student(AD2.id, Bob.id)
        subject_dao.add_subject_student(AD3.id, Bob.id)

        # maak assistenten ook teachers van de subjects
        subject_dao.add_subject_teacher(AD2.id, Rien.id)

        # voeg project toe
        project_dao.create_project(AD2_project, subject_id=AD2.id)

        # voeg de groepen toe aan de databank
        group_dao.create_group(group=Group_1_AD2, project_id=AD2_project.id)
        group_dao.create_group(group=Group_2_AD2, project_id=AD2_project.id)

        # voeg studenten toe aan de groep
        group_dao.add_student_group(student_id=Alberic.id, group_id=Group_1_AD2.id)
        group_dao.add_student_group(student_id=Bob.id, group_id=Group_1_AD2.id)

        # voeg de submission toe
        submission_dao.create_submission(submission=AD2_project_submission1,
                                         group_id=Group_1_AD2.id,
                                         student_id=Alberic.id)

        submission_dao.create_submission(submission=AD2_project_submission2,
                                         group_id=Group_1_AD2.id,
                                         student_id=Bob.id)

