from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.StudentDAO import StudentDAO
from db.models.models import Student, User
from domain.models.models import StudentDataclass


class SqlStudentDAO(StudentDAO):
    def get_student(self, ident: int) -> StudentDataclass:
        student: Student = Student.query.get(ident=ident)
        if not student:
            raise ItemNotFoundError("StudentDataclass with given id not found")
        return student.to_domain_model()

    def get_all_students(self) -> list[StudentDataclass]:
        students: list[Student] = Student.query.all()
        return [student.to_domain_model() for student in students]

    def create_student(self, user_id: int):
        user: User = User.query.get(ident=user_id)

        if not user:
            raise ItemNotFoundError("User with given id not found.")

        new_student: Student = Student()
        new_student.id = user_id

        db.session.add(new_student)
        db.session.commit()
