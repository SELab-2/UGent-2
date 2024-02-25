from db.errors.database_errors import ItemNotFoundError
from db.extensions import db
from db.interface.ProjectDAO import ProjectDAO
from db.models.models import Project, Subject
from domain.models.models import ProjectDataclass


class SqlProjectDAO(ProjectDAO):
    def create_project(self, project: ProjectDataclass, subject_id: int):
        subject = Subject.query.get(subject_id)
        if not subject:
            raise ItemNotFoundError(f"Het subject met id {subject_id} kon niet in de databank gevonden worden")

        new_project = Project()
        new_project.subject_id = subject_id
        new_project.name = project.name
        new_project.deadline = project.deadline
        new_project.archived = project.archived
        new_project.requirements = project.requirements
        new_project.visible = project.visible
        new_project.max_students = project.max_students
        db.session.add(new_project)
        db.session.commit()

        project.id = new_project.id

    def get_project(self, project_id: int) -> ProjectDataclass:
        project = Project.query.get(project_id)
        if not project:
            raise ItemNotFoundError(f"Het project met id {project_id} kon niet in de databank gevonden worden")
        return project

    def get_projects(self, subject_id: int) -> list[ProjectDataclass]:
        subject = Subject.query.get(subject_id)
        if not subject:
            raise ItemNotFoundError(f"Het subject met id {subject_id} kon niet in de databank gevonden worden")
        projects: list[Project] = subject.projects
        return [project.name for project in projects]
