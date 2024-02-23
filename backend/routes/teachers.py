import json
from http import HTTPStatus

from backend.db.implementation.SqlLesgeverDAO import SqlTeacherDAO
from backend.db.interface.TeacherDAO import TeacherDAO
from backend.domain.models.models import Teacher
from backend.domain.validation.TeacherValidator import TeacherValidator
from backend.domain.validation.ValidationResult import ValidationResult
from flask import Blueprint, Response, request

teachers_blueprint = Blueprint("teachers", __name__)


@teachers_blueprint.route("/teachers")
def get_teachers():
    dao: TeacherDAO = SqlTeacherDAO()

    teachers: list[Teacher] = dao.get_all_teachers()
    teachers_json = [teacher.to_dict() for teacher in teachers]

    return Response(json.dumps(teachers_json, indent=4), content_type="application/json")


@teachers_blueprint.route("/teachers/<int:teacher_id>")
def get_teacher(teacher_id):
    dao: TeacherDAO = SqlTeacherDAO()

    teacher: Teacher = dao.get_teacher(teacher_id)
    teacher_json = teacher.to_dict()

    return Response(json.dumps(teacher_json, indent=4), content_type="application/json")


@teachers_blueprint.route("/teachers", methods=["POST"])
def create_teacher():

    teacher_data: dict = request.get_json()

    if not teacher_data:
        return json.dumps({"error": "Foute JSON of Content-Type"}), HTTPStatus.BAD_REQUEST

    validation_result: ValidationResult = TeacherValidator.validate(teacher_data)

    if not validation_result.is_ok:
        return json.dumps({"error": validation_result.errors}), HTTPStatus.BAD_REQUEST

    dao: TeacherDAO = SqlTeacherDAO()
    lesgever = Teacher(**teacher_data)  # Vul alle velden van het dataobject in met de json
    dao.create_teacher(lesgever)

    return json.dumps(lesgever.to_dict()), HTTPStatus.CREATED
