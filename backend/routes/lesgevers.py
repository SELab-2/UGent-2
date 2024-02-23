import json
from http import HTTPStatus

from backend.db.implementation.SqlLesgeverDAO import SqlLesgeverDAO
from backend.db.interface.LesgeverDAO import LesgeverDAO
from backend.domain.models.models import Lesgever
from backend.domain.validation.LesgeverValidator import LesgeverValidator
from backend.domain.validation.ValidationResult import ValidationResult
from flask import Blueprint, Response, request

lesgevers_blueprint = Blueprint("lesgevers", __name__)


@lesgevers_blueprint.route("/lesgevers")
def get_lesgevers():
    dao: LesgeverDAO = SqlLesgeverDAO()

    lesgevers: list[Lesgever] = dao.get_all_lesgevers()
    lesgevers_json = [lesgever.to_dict() for lesgever in lesgevers]

    return Response(json.dumps(lesgevers_json, indent=4), content_type="application/json")


@lesgevers_blueprint.route("/lesgevers/<int:lesgever_id>")
def get_lesgever(lesgever_id):
    dao: LesgeverDAO = SqlLesgeverDAO()

    lesgever: Lesgever = dao.get_lesgever(lesgever_id)
    lesgever_json = lesgever.to_dict()

    return Response(json.dumps(lesgever_json, indent=4), content_type="application/json")


@lesgevers_blueprint.route("/lesgevers", methods=["POST"])
def create_lesgever():

    lesgever_data: dict = request.get_json()

    if not lesgever_data:
        return json.dumps({"error": "Foute JSON of Content-Type"}), HTTPStatus.BAD_REQUEST

    validation_result: ValidationResult = LesgeverValidator.validate(lesgever_data)

    if not validation_result.is_ok:
        return json.dumps({"error": validation_result.errors}), HTTPStatus.BAD_REQUEST

    dao: LesgeverDAO = SqlLesgeverDAO()
    lesgever = Lesgever(**lesgever_data)
    dao.create_lesgever(lesgever)

    return json.dumps(lesgever.to_dict()), HTTPStatus.CREATED
