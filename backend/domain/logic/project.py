from datetime import datetime

from sqlmodel import Session

from db.models.models import Project, Student, Subject, Teacher
from domain.logic.basic_operations import get, get_all
from domain.models.ProjectDataclass import ProjectInput


def create_project(
    session: Session,
    subject_id: int,
    name: str,
    deadline: datetime,
    archived: bool,
    description: str,
    requirements: str,
    visible: bool,
    max_students: int,
) -> Project:
    """
    Create a project for a certain subject.
    """
    subject: Subject = get(session, Subject, subject_id)

    new_project: Project = Project(
        name=name,
        deadline=deadline,
        archived=archived,
        description=description,
        requirements=requirements,
        visible=visible,
        max_students=max_students,
    )

    subject.projects.append(new_project)
    session.commit()

    return new_project


def get_project(session: Session, project_id: int) -> Project:
    return get(session, Project, project_id)


def get_all_projects(session: Session) -> list[Project]:
    return get_all(session, Project)


def get_projects_of_subject(session: Session, subject_id: int) -> list[Project]:
    subject: Subject = get(session, Subject, ident=subject_id)
    return subject.projects


def get_projects_of_student(session: Session, user_id: int) -> list[Project]:
    student = get(session, Student, ident=user_id)
    subjects = student.subjects
    projects = []
    for i in subjects:
        projects += i.projects
    return projects


def get_projects_of_teacher(session: Session, user_id: int) -> list[Project]:
    teacher = get(session, Teacher, ident=user_id)
    subjects = teacher.subjects
    projects = []
    for i in subjects:
        projects += i.projects
    return projects


def update_project(session: Session, project_id: int, project: ProjectInput) -> None:
    project_db = get(session, Project, project_id)
    project_db.archived = project.archived
    project_db.deadline = project.deadline
    project_db.description = project.description
    project_db.max_students = project.max_students
    project_db.name = project.name
    project_db.requirements = project.requirements
    project_db.visible = project.visible
    session.commit()
