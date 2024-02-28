from datetime import datetime

from sqlalchemy.orm import Session

from db.errors.database_errors import ItemNotFoundError
from db.extensions import engine
from db.implementation.SqlAbstractDAO import SqlAbstractDAO
from db.interface.ProjectDAO import ProjectDAO
from db.models.models import Project, Subject
from domain.models.ProjectDataclass import ProjectDataclass


class SqlProjectDAO(ProjectDAO, SqlAbstractDAO[Project, ProjectDataclass]):

    @staticmethod
    def get_all() -> list[ProjectDataclass]:
        return SqlAbstractDAO.get_all()

    @staticmethod
    def get_object(ident: int) -> ProjectDataclass:
        return SqlAbstractDAO.get_object(ident)

    @staticmethod
    def create_project(subject_id: int, name: str, deadline: datetime, archived: bool, requirements: str,
                       visible: bool, max_students: int) -> ProjectDataclass:
        with Session(engine) as session:
            subject: Subject | None = session.get(Subject, subject_id)
            if not subject:
                msg = f"Subject with id {subject_id} not found"
                raise ItemNotFoundError(msg)

            new_project: Project = Project(subject_id=subject_id, name=name, deadline=deadline,
                                           archived=archived, requirements=requirements, visible=visible,
                                           max_students=max_students)

            session.add(new_project)
            session.commit()
            return new_project.to_domain_model()

    @staticmethod
    def get_projects_of_subject(subject_id: int) -> list[ProjectDataclass]:
        with Session(engine) as session:
            subject: Subject | None = session.get(Subject, ident=subject_id)
            if not subject:
                msg = f"Subject with id {subject_id} not found"
                raise ItemNotFoundError(msg)
            projects: list[Project] = subject.projects
            return [project.to_domain_model() for project in projects]
