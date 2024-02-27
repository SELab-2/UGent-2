
from fastapi import APIRouter

from db.implementation.SqlTeacherDAO import SqlTeacherDAO
from db.interface.TeacherDAO import TeacherDAO
from domain.models.TeacherDataclass import TeacherDataclass

teachers_router = APIRouter()


@teachers_router.get("/teachers")
def get_teachers() -> list[TeacherDataclass]:
    dao: TeacherDAO = SqlTeacherDAO()
    return dao.get_all_teachers()


@teachers_router.get("/teachers/{teacher_id}")
def get_teacher(teacher_id: int) -> TeacherDataclass:
    dao: TeacherDAO = SqlTeacherDAO()
    return dao.get_teacher(teacher_id)


@teachers_router.post("/teachers")
def create_teacher(teacher_data: TeacherDataclass) -> TeacherDataclass:

    # can be commented because of the validation that happens through pydantic and FastAPI
    # woordjes if not teacher_data:
    # woordjes    return Response(json.dumps({"error": "Foute JSON of Content-Type"}), status=HTTPStatus.BAD_REQUEST)

    # woordjes validation_result: ValidationResult = TeacherValidator.validate(teacher_data)
    #
    # woordjes if not validation_result:
    # woordjes    return Response(json.dumps({"error": validation_result.errors}), status=HTTPStatus.BAD_REQUEST)

    dao: TeacherDAO = SqlTeacherDAO()
    # is niet meer nodig omdat teacher_data een instance is van TeacherDataclass
    # woordjes lesgever = TeacherDataclass(**teacher_data)  # Vul alle velden van het dataobject in met de json
    dao.create_teacher(teacher_data.name, teacher_data.email)
    return teacher_data
