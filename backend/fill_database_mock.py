from datetime import datetime

from psycopg2 import tz

from db.extensions import db
from db.implementation.SqlAdminDAO import SqlAdminDAO
from db.implementation.SqlGroupDAO import SqlGroupDAO
from db.implementation.SqlProjectDAO import SqlProjectDAO
from db.implementation.SqlStudentDAO import SqlStudentDAO
from db.implementation.SqlSubjectDAO import SqlSubjectDAO
from db.implementation.SqlTeacherDAO import SqlTeacherDAO

if __name__ == "__main__":
    db.create_all()

    admin_dao = SqlAdminDAO()
    student_dao = SqlStudentDAO()
    teacher_dao = SqlTeacherDAO()
    subject_dao = SqlSubjectDAO()
    group_dao = SqlGroupDAO()
    project_dao = SqlProjectDAO()

    # maak een vak
    objeprog = subject_dao.create_subject(name="OBJECTGERICHTPROGRAMMEREN")

    # maak een project voor dat vak
    objeprog_project = project_dao.create_project(subject_id=objeprog.id,
                                                  name="PROJECT",
                                                  archived=False,
                                                  visible=True,
                                                  requirements="Maak iets in javafx",
                                                  max_students=2,
                                                  deadline=datetime(2000, 1, 1, 0, 0, 0, tzinfo=tz.LOCAL))

    # maak een groepje voor het project van objeprog
    groep1 = group_dao.create_group(project_id=objeprog_project.id)

    # maak studenten
    student1 = student_dao.create_student("Student1", "Student1@gmail.com")
    student2 = student_dao.create_student("Student2", "Student2@gmail.com")
    student3 = student_dao.create_student("Student3", "Student3@gmail.com")

    # maak teacher
    teacher1 = teacher_dao.create_teacher("Teacher1", "Teacher1@gmail.com")

    # voeg teacher toe aan objeprog
    subject_dao.add_teacher_to_subject(teacher1.id, objeprog.id)

    # voeg studenten toe aan de groep
    group_dao.add_student_to_group(student1.id, groep1.id)
    group_dao.add_student_to_group(student2.id, groep1.id)
    group_dao.add_student_to_group(student3.id, groep1.id)
