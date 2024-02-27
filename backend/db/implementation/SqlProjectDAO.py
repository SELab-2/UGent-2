from datetime import datetime

from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.ProjectDAO import ProjectDAO
from db.models.models import Project, Subject
from domain.models.ProjectDataclass import ProjectDataclass


class SqlProjectDAO(ProjectDAO):
    def create_project(self, subject_id: int, name: str, deadline: datetime, archived: bool, requirements: str,
                       visible: bool, max_students: int) -> ProjectDataclass:
        subject: Subject | None = db.session.get(Subject, subject_id)
        if not subject:
            msg = f"Subject with id {subject_id} not found"
            raise ItemNotFoundError(msg)

        new_project: Project = Project(subject_id=subject_id, name=name, deadline=deadline,
                                       archived=archived, requirements=requirements, visible=visible,
                                       max_students=max_students)

        db.session.add(new_project)
        db.session.commit()
        return new_project.to_domain_model()


    def get_project(self, project_id: int) -> ProjectDataclass:
        project: Project | None = db.session.get(Project, ident=project_id)
        if not project:
            msg = f"Project with id {project_id} not found"
            raise ItemNotFoundError(msg)
        return project.to_domain_model()

    def get_projects_of_subject(self, subject_id: int) -> list[ProjectDataclass]:
        subject: Subject | None = db.session.get(Subject, ident=subject_id)
        if not subject:
            msg = f"Subject with id {subject_id} not found"
            raise ItemNotFoundError(msg)
        projects: list[Project] = subject.projects
        return [project.to_domain_model() for project in projects]
