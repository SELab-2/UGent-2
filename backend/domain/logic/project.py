from datetime import datetime

from pydantic import ValidationError
from sqlmodel import Session

from db.models import Course, Project, ProjectInput, Student, Teacher
from domain.logic.basic_operations import get, get_all
from domain.simple_submission_checks.constraints.submission_constraint import create_constraint_from_json
from errors.logic_errors import ArchivedError, InvalidConstraintsError


def create_project(
    session: Session,
    course_id: int,
    name: str,
    deadline: datetime,
    archived: bool,
    description: str,
    requirements: str,
    visible: bool,
    max_students: int,
    dockerfile: str,
) -> Project:
    """
    Create a project for a certain course.
    """
    course: Course = get(session, Course, course_id)
    if course.archived:
        raise ArchivedError

    new_project: Project = Project(
        name=name,
        deadline=deadline,
        archived=archived,
        description=description,
        requirements=requirements,
        visible=visible,
        max_students=max_students,
        dockerfile=dockerfile,
        image_id="",
    )

    course.projects.append(new_project)
    session.commit()

    return new_project


def get_project(session: Session, project_id: int) -> Project:
    return get(session, Project, project_id)


def get_all_projects(session: Session) -> list[Project]:
    return get_all(session, Project)


def get_projects_of_course(session: Session, course_id: int) -> list[Project]:
    course: Course = get(session, Course, ident=course_id)
    return course.projects


def get_projects_of_student(session: Session, user_id: int) -> list[Project]:
    student = get(session, Student, ident=user_id)
    courses = student.courses
    projects = []
    for i in courses:
        projects += i.projects
    return projects


def get_projects_of_teacher(session: Session, user_id: int) -> list[Project]:
    teacher = get(session, Teacher, ident=user_id)
    courses = teacher.courses
    projects = []
    for i in courses:
        projects += i.projects
    return projects


def update_project(session: Session, project_id: int, project: ProjectInput) -> None:
    project_db = get(session, Project, project_id)
    if project_db.course.archived:
        raise ArchivedError
    project_db.archived = project.archived
    project_db.deadline = project.deadline
    project_db.description = project.description
    project_db.max_students = project.max_students
    project_db.name = project.name
    project_db.requirements = project.requirements
    project_db.visible = project.visible
    project_db.dockerfile = project.dockerfile
    session.commit()


def validate_constraints(requirements: str) -> None:
    try:
        create_constraint_from_json(requirements)
    except ValidationError as err:
        raise InvalidConstraintsError from err
