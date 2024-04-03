from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.project import get_projects_of_teacher
from domain.logic.subject import add_teacher_to_subject, create_subject, get_subjects_of_teacher
from domain.models.ProjectDataclass import ProjectDataclass
from domain.models.SubjectDataclass import SubjectDataclass, SubjectInput
from domain.models.TeacherDataclass import TeacherDataclass
from routes.dependencies.role_dependencies import get_authenticated_teacher
from routes.tags.swagger_tags import Tags

teacher_router = APIRouter()


@teacher_router.get("/teacher/subjects", tags=[Tags.TEACHER], summary="Get all subjects the teacher manages.")
def subjects_of_teacher_get(
    session: Session = Depends(get_session),
    teacher: TeacherDataclass = Depends(get_authenticated_teacher),
) -> list[SubjectDataclass]:
    return get_subjects_of_teacher(session, teacher.id)


@teacher_router.get("/teacher/projects", tags=[Tags.TEACHER], summary="Get all projects of the teacher.")
def projects_of_teacher_get(
    session: Session = Depends(get_session),
    teacher: TeacherDataclass = Depends(get_authenticated_teacher),
) -> list[ProjectDataclass]:
    return get_projects_of_teacher(session, teacher.id)


@teacher_router.post("/teacher/subjects", tags=[Tags.SUBJECT], summary="Create a new subject.")
def create_subject_post(
    subject: SubjectInput,
    teacher: TeacherDataclass = Depends(get_authenticated_teacher),
    session: Session = Depends(get_session),
) -> SubjectDataclass:
    new_subject = create_subject(session, name=subject.name)
    add_teacher_to_subject(session, teacher_id=teacher.id, subject_id=new_subject.id)
    return new_subject
