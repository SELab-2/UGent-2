from db.errors.database_errors import ItemNotFoundError, UniqueConstraintError
from db.extensions import db
from db.interface.GroupDAO import GroupDAO
from db.models.models import Group, Project, Student
from domain.models.GroupDataclass import GroupDataclass
from domain.models.StudentDataclass import StudentDataclass


class SqlGroupDAO(GroupDAO):
    def create_group(self, project_id: int) -> None:
        project: Project | None = db.session.get(Project, ident=project_id)
        if not project:
            msg = f"Project with id {project} not found"
            raise ItemNotFoundError(msg)
        new_group: Group = Group(project_id=project_id, project=project)
        db.session.add(new_group)
        db.session.commit()

    def get_group(self, group_id: int) -> GroupDataclass:
        group: Group | None = db.session.get(Group, ident=group_id)
        if not group:
            msg = f"Group with id {group_id} not found"
            raise ItemNotFoundError(msg)
        return group.to_domain_model()

    def get_groups_of_project(self, project_id: int) -> list[GroupDataclass]:
        project: Project | None = db.session.get(Project, ident=project_id)
        if not project:
            msg = f"Project with id {project} not found"
            raise ItemNotFoundError(msg)
        groups: list[Group] = project.groups
        return [group.to_domain_model() for group in groups]

    def get_groups_of_student(self, student_id: int) -> list[GroupDataclass]:
        student: Student | None = db.session.get(Student, ident=student_id)
        if not student:
            msg = f"Student with id {student_id} not found"
            raise ItemNotFoundError(msg)
        groups: list[Group] = student.groups
        return [group.to_domain_model() for group in groups]

    def add_student_to_group(self, student_id: int, group_id: int) -> None:
        student: Student | None = db.session.get(Student, ident=student_id)
        group: Group | None = db.session.get(Group, ident=group_id)
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
        db.session.add(group)
        db.session.commit()

    def get_students_of_group(self, group_id: int) -> list[StudentDataclass]:
        group: Group | None = db.session.get(Group, ident=group_id)
        if not group:
            msg = f"Group with id {group_id} not found"
            raise ItemNotFoundError(msg)
        students: list[Student] = group.students
        return [student.to_domain_model() for student in students]
