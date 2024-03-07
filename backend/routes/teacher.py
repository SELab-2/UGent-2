from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from starlette.responses import Response

from db.sessions import get_session
from domain.logic.subject import create_subject, get_subjects_of_teacher
from domain.models.SubjectDataclass import SubjectDataclass
from domain.models.TeacherDataclass import TeacherDataclass
from routes.dependencies.role_dependencies import get_authenticated_teacher

teacher_router = APIRouter()


@teacher_router.get("/teacher/subjects")
def subjects_of_teacher_get(
        session: Session = Depends(get_session),
        teacher: TeacherDataclass = Depends(get_authenticated_teacher),
) -> list[SubjectDataclass]:
    return get_subjects_of_teacher(session, teacher.id)


@teacher_router.post("/teacher/subjects", dependencies=[Depends(get_authenticated_teacher)])
def create_subject_post(
    subject: SubjectDataclass,
    session: Session = Depends(get_session),
) -> Response:
    create_subject(session, name=subject.name)
    return Response(status_code=status.HTTP_201_CREATED)



