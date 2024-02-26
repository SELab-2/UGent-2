from db.errors.database_errors import ItemNotFoundError, UniqueConstraintError
from db.extensions import db
from db.interface.SubjectDAO import SubjectDAO
from db.models.models import Student, Subject, Teacher
from domain.models.models import SubjectDataclass


class SqlSubjectDAO(SubjectDAO):
    def create_subject(self, subject: SubjectDataclass, teacher_id: int):
        teacher = Teacher.query.get(teacher_id)

        if not teacher:
            raise ItemNotFoundError(f"De teacher met id {teacher_id} kon niet in de databank gevonden worden")

        new_subject = Subject()
        new_subject.name = subject.name
        new_subject.teachers.append(teacher)

        db.session.add(new_subject)
        db.session.commit()

        subject.id = new_subject.id

    def get_subject(self, teacher_id: int):
        subject = Subject.query.get(teacher_id)
        if not subject:
            raise ItemNotFoundError(f"De lesgever met id {teacher_id} kon niet in de databank gevonden worden")

        return subject.to_domain_model()

    def get_subjects_of_teacher(self, teacher_id: int) -> list[SubjectDataclass]:
        teacher: Teacher = Teacher.query.get(ident=teacher_id)

        if not teacher:
            raise ItemNotFoundError(f"De teacher met id {teacher_id} kon niet in de databank gevonden worden")

        subjects: list[Subject] = teacher.subjects
        return [vak.to_domain_model() for vak in subjects]

    def get_subjects_of_student(self, student_id: int) -> list[SubjectDataclass]:
        student: Student = Student.query.get(ident=student_id)

        if not student:
            raise ItemNotFoundError(f"De student met id {student_id} kon niet in de databank gevonden worden")

        subjects: list[Subject] = student.subjects
        return [vak.to_domain_model() for vak in subjects]

    def add_subject_to_student(self, subject_id: int, student_id: int):
        student: Student = Student.query.get(ident=student_id)
        subject: Subject = Subject.query.get(ident=subject_id)

        if not student:
            raise ItemNotFoundError(f"De student met id {student_id} kon niet in de databank gevonden worden")
        if not subject:
            raise ItemNotFoundError(f"Het subject met id {subject_id} kon niet in de databank gevonden worden")
        if subject in student.subjects:
            raise UniqueConstraintError(f"De student met id {student_id} volgt het vak met id {student_id} al")

        student.subjects.append(subject)

    def add_subject_to_teacher(self, subject_id: int, teacher_id: int):
        teacher: Teacher = Teacher.query.get(ident=teacher_id)
        subject: Subject = Subject.query.get(ident=subject_id)

        if not teacher:
            raise ItemNotFoundError(f"De teacher met id {teacher_id} kon niet in de databank gevonden worden")
        if not subject:
            raise ItemNotFoundError(f"Het subject met id {subject_id} kon niet in de databank gevonden worden")
        if subject in teacher.subjects:
            raise UniqueConstraintError(f"De teacher met id {teacher_id} volgt het vak met id {subject_id} al")

        teacher.subjects.append(subject)
