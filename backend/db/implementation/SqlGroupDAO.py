from db.errors.database_errors import ItemNotFoundError, UniqueConstraintError
from db.extensions import db
from db.interface.GroupDAO import GroupDAO
from db.models.models import Group, Project, Student
from domain.models.models import GroupDataclass, StudentDataclass


class SqlGroupDAO(GroupDAO):
    def create_group(self, group: GroupDataclass, project_id: int):
        project = Project.query.get(project_id)
        if not project:
            raise ItemNotFoundError(f"Het project met id {project_id} kon niet in de databank gevonden worden")
        new_group: Group = Group()
        new_group.project_id = project_id
        new_group.project = project
        db.session.add(new_group)
        db.session.commit()

        group.id = new_group.id

    def get_group(self, group_id: int) -> GroupDataclass:
        group = Group.query.get(group_id)
        if not group:
            raise ItemNotFoundError(f"De groep met id {group_id} kon niet in de databank gevonden worden")
        return group.to_domain_model()

    def get_groups_of_project(self, project_id: int) -> list[GroupDataclass]:
        project = Project.query.get(project_id)
        if not project:
            raise ItemNotFoundError(f"Het project met id {project_id} kon niet in de databank gevonden worden")
        groups: list[Group] = project.groups
        return [group.to_domain_model() for group in groups]

    def get_groups_of_student(self, student_id: int) -> list[GroupDataclass]:
        student = Student.query.get(student_id)
        if not student:
            raise ItemNotFoundError(f"De student met id {student_id} kon niet in de databank gevonden worden")
        groups: list[Group] = student.groups
        return [group.to_domain_model() for group in groups]

    def add_student_to_group(self, student_id: int, group_id: int):
        student = Student.query.get(student_id)
        group = Group.query.get(group_id)
        if not student:
            raise ItemNotFoundError(f"De student met id {student_id} kon niet in de databank gevonden worden")
        if not group:
            raise ItemNotFoundError(f"De group met id {group_id} kon niet in de databank gevonden worden")
        if student in group.students:
            raise UniqueConstraintError(f"De student met id {student_id} zit al in de groep met id {group_id}")

        group.students.append(student)

    def get_students_of_group(self, group_id: int) -> list[StudentDataclass]:
        group = Group.query.get(group_id)
        if not group:
            raise ItemNotFoundError(f"De group met id {group_id} kon niet in de databank gevonden worden")
        students: list[Student] = group.students
        return [student.to_domain_model() for student in students]
