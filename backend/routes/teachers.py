
from fastapi import APIRouter

from db.implementation.SqlTeacherDAO import SqlTeacherDAO
from db.interface.TeacherDAO import TeacherDAO
from domain.models.TeacherDataclass import TeacherDataclass

teachers_router = APIRouter()


@teachers_router.get("/teachers")
def get_teachers():
    dao: TeacherDAO = SqlTeacherDAO()

    teachers: list[TeacherDataclass] = dao.get_all_teachers()
    teachers_json = [teacher.to_dict() for teacher in teachers]

    return teachers_json


@teachers_router.get("/teachers/{teacher_id}")
def get_teacher(teacher_id: int):
    dao: TeacherDAO = SqlTeacherDAO()

    teacher: TeacherDataclass = dao.get_teacher(teacher_id)
    teacher_json = teacher.to_dict()

    return teacher_json


@teachers_router.post("/teachers")
def create_teacher(teacher_data: TeacherDataclass):

    # can be commented because of the validation that happens through pydantic and FastAPI
    # if not teacher_data:
    #     return Response(json.dumps({"error": "Foute JSON of Content-Type"}), status=HTTPStatus.BAD_REQUEST)

    # validation_result: ValidationResult = TeacherValidator.validate(teacher_data)
    #
    # if not validation_result:
    #     return Response(json.dumps({"error": validation_result.errors}), status=HTTPStatus.BAD_REQUEST)

    dao: TeacherDAO = SqlTeacherDAO()
    # is niet meer nodig omdat teacher_data een instance is van TeacherDataclass
    # lesgever = TeacherDataclass(**teacher_data)  # Vul alle velden van het dataobject in met de json
    dao.create_teacher(teacher_data.name, teacher_data.email)

    return teacher_data
