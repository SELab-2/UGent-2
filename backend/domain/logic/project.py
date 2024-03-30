from datetime import datetime

from sqlalchemy.orm import Session

from db.models.models import Project, Student, Subject, Teacher
from domain.logic.basic_operations import get, get_all
from domain.models.ProjectDataclass import ProjectDataclass, ProjectInput
from domain.models.TeacherDataclass import TeacherDataclass


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
) -> ProjectDataclass:
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

    return new_project.to_domain_model()


def get_project(session: Session, project_id: int) -> ProjectDataclass:
    return get(session, Project, project_id).to_domain_model()


def get_all_projects(session: Session) -> list[ProjectDataclass]:
    return [project.to_domain_model() for project in get_all(session, Project)]


def get_projects_of_subject(session: Session, subject_id: int) -> list[ProjectDataclass]:
    subject: Subject = get(session, Subject, ident=subject_id)
    projects: list[Project] = subject.projects
    return [project.to_domain_model() for project in projects]


def get_teachers_of_subject(session: Session, subject_id: int) -> list[TeacherDataclass]:
    subject: Subject = get(session, Subject, ident=subject_id)
    teachers = subject.teachers
    return [teacher.to_domain_model() for teacher in teachers]


def get_projects_of_student(session: Session, user_id: int) -> list[ProjectDataclass]:
    student = get(session, Student, ident=user_id)
    subjects = student.subjects
    projects = []
    for i in subjects:
        projects += i.projects
    return [project.to_domain_model() for project in projects]


def get_projects_of_teacher(session: Session, user_id: int) -> list[ProjectDataclass]:
    teacher = get(session, Teacher, ident=user_id)
    subjects = teacher.subjects
    projects = []
    for i in subjects:
        projects += i.projects
    return [project.to_domain_model() for project in projects]


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
