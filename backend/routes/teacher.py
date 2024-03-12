from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.sessions import get_session
from domain.logic.subject import add_teacher_to_subject, create_subject, get_subjects_of_teacher
from domain.models.SubjectDataclass import SubjectDataclass, SubjectInput
from domain.models.TeacherDataclass import TeacherDataclass
from routes.dependencies.role_dependencies import get_authenticated_teacher

teacher_router = APIRouter()


@teacher_router.get("/teacher/subjects")
def subjects_of_teacher_get(
    session: Session = Depends(get_session),
    teacher: TeacherDataclass = Depends(get_authenticated_teacher),
) -> list[SubjectDataclass]:
    return get_subjects_of_teacher(session, teacher.id)


@teacher_router.post("/teacher/subjects")
def create_subject_post(
    subject: SubjectInput,
    teacher: TeacherDataclass = Depends(get_authenticated_teacher),
    session: Session = Depends(get_session),
) -> SubjectDataclass:
    new_subject = create_subject(session, name=subject.name)
    add_teacher_to_subject(session, teacher_id=teacher.id, subject_id=new_subject.id)
    return new_subject
