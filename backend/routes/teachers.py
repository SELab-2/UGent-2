import json
from http import HTTPStatus

from flask import Blueprint, Response, request

from db.implementation.SqlLesgeverDAO import SqlTeacherDAO
from db.interface.TeacherDAO import TeacherDAO
from domain.models.TeacherDataclass import TeacherDataclass
from domain.validation.TeacherValidator import TeacherValidator
from domain.validation.ValidationResult import ValidationResult

teachers_blueprint = Blueprint("teachers", __name__)


@teachers_blueprint.route("/teachers")
def get_teachers() -> Response:
    dao: TeacherDAO = SqlTeacherDAO()

    teachers: list[TeacherDataclass] = dao.get_all_teachers()
    teachers_json = [teacher.to_dict() for teacher in teachers]

    return Response(json.dumps(teachers_json, indent=4), content_type="application/json")


@teachers_blueprint.route("/teachers/<int:teacher_id>")
def get_teacher(teacher_id: int) -> Response:
    dao: TeacherDAO = SqlTeacherDAO()

    teacher: TeacherDataclass = dao.get_teacher(teacher_id)
    teacher_json = teacher.to_dict()

    return Response(json.dumps(teacher_json, indent=4), content_type="application/json")


@teachers_blueprint.route("/teachers", methods=["POST"])
def create_teacher() -> Response:
    teacher_data: dict = request.get_json()

    if not teacher_data:
        return Response(json.dumps({"error": "Foute JSON of Content-Type"}), status=HTTPStatus.BAD_REQUEST)

    validation_result: ValidationResult = TeacherValidator.validate(teacher_data)

    if not validation_result.is_ok:
        return Response(json.dumps({"error": validation_result.errors}), status=HTTPStatus.BAD_REQUEST)

    dao: TeacherDAO = SqlTeacherDAO()
    lesgever = TeacherDataclass(**teacher_data)  # Vul alle velden van het dataobject in met de json
    dao.create_teacher(lesgever)

    return Response(json.dumps(lesgever.to_dict()), status=HTTPStatus.CREATED)
