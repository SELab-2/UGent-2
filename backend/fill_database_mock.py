from app import app
from db.extensions import db
from db.implementation.SqlAdminDAO import SqlAdminDAO
from db.implementation.SqlStudentDAO import SqlStudentDAO
from db.implementation.SqlSubjectDAO import SqlSubjectDAO
from db.implementation.SqlTeacherDAO import SqlTeacherDAO

if __name__ == "__main__":
    with app.app_context():

        db.create_all()

        admin_dao = SqlAdminDAO()
        student_dao = SqlStudentDAO()
        teacher_dao = SqlTeacherDAO()
        subject_dao = SqlSubjectDAO()

