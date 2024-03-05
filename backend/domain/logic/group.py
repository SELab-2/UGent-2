from typing import Type

from sqlalchemy.orm import Session

from db.errors.database_errors import UniqueConstraintError
from db.models.models import Project, Group, Student
from domain.logic.basic_operations import get
from domain.models.GroupDataclass import GroupDataclass
from domain.models.StudentDataclass import StudentDataclass


def create_group(session: Session, project_id: int) -> GroupDataclass:
    project: Project = get(session, Type[Project], project_id)
    new_group: Group = Group(project_id=project_id)
    project.groups.append(new_group)

    session.add(new_group)
    session.commit()

    return new_group.to_domain_model()


def get_groups_of_project(session: Session, project_id: int) -> list[GroupDataclass]:
    project: Project = get(session, Type[Project], project_id)
    groups: list[Group] = project.groups
    return [group.to_domain_model() for group in groups]


def get_groups_of_student(session: Session, student_id: int) -> list[GroupDataclass]:
    student: Student = get(session, Type[Student], ident=student_id)
    groups: list[Group] = student.groups
    return [group.to_domain_model() for group in groups]


def add_student_to_group(session: Session, student_id: int, group_id: int) -> None:
    student: Student = get(session, Type[Student], ident=student_id)
    group: Group = get(session, Type[Group], ident=group_id)

    if student in group.students:
        msg = f"Student with id {student_id} already in group with id {group_id}"
        raise UniqueConstraintError(msg)

    group.students.append(student)
    session.commit()


def get_students_of_group(session: Session, group_id: int) -> list[StudentDataclass]:
    group: Group = get(session, Type[Group], ident=group_id)
    students: list[Student] = group.students
    return [student.to_domain_model() for student in students]
