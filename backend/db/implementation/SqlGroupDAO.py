from sqlalchemy.orm import Session

from db.errors.database_errors import ItemNotFoundError, UniqueConstraintError
from db.extensions import engine
from db.implementation.SqlAbstractDAO import SqlAbstractDAO
from db.interface.GroupDAO import GroupDAO
from db.models.models import Group, Project, Student
from domain.models.GroupDataclass import GroupDataclass
from domain.models.StudentDataclass import StudentDataclass


class SqlGroupDAO(SqlAbstractDAO[Group, GroupDataclass], GroupDAO):
    def __init__(self) -> None:
        self.model_class = Group

    def create_group(self, project_id: int) -> GroupDataclass:
        with Session(engine) as session:
            project: Project | None = session.get(Project, ident=project_id)
            if not project:
                msg = f"Project with id {project} not found"
                raise ItemNotFoundError(msg)
            new_group: Group = Group(project_id=project_id)
            session.add(new_group)
            session.commit()
            return new_group.to_domain_model()

    def get_groups_of_project(self, project_id: int) -> list[GroupDataclass]:
        with Session(engine) as session:
            project: Project | None = session.get(Project, ident=project_id)
            if not project:
                msg = f"Project with id {project} not found"
                raise ItemNotFoundError(msg)
            groups: list[Group] = project.groups
            return [group.to_domain_model() for group in groups]

    def get_groups_of_student(self, student_id: int) -> list[GroupDataclass]:
        with Session(engine) as session:
            student: Student | None = session.get(Student, ident=student_id)
            if not student:
                msg = f"Student with id {student_id} not found"
                raise ItemNotFoundError(msg)
            groups: list[Group] = student.groups
            return [group.to_domain_model() for group in groups]

    def add_student_to_group(self, student_id: int, group_id: int) -> None:
        with Session(engine) as session:
            student: Student | None = session.get(Student, ident=student_id)
            group: Group | None = session.get(Group, ident=group_id)
            if not student:
                msg = f"Student with id {student_id} not found"
                raise ItemNotFoundError(msg)
            if not group:
                msg = f"Group with id {group_id} not found"
                raise ItemNotFoundError(msg)
            if student in group.students:
                msg = f"Student with id {student_id} already in group with id {group_id}"
                raise UniqueConstraintError(msg)

            group.students.append(student)
            session.commit()

    def get_students_of_group(self, group_id: int) -> list[StudentDataclass]:
        with Session(engine) as session:
            group: Group | None = session.get(Group, ident=group_id)
            if not group:
                msg = f"Group with id {group_id} not found"
                raise ItemNotFoundError(msg)
            students: list[Student] = group.students
            return [student.to_domain_model() for student in students]
