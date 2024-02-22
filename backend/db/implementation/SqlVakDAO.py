from backend.db.errors.database_errors import ItemNotFoundException
from backend.db.interface.VakDAO import VakDAO
from backend.db.models.models import LesgeverModel, VakModel
from backend.domain.models.models import Vak
from backend.routes.extentions import db


class SqlVakDAO(VakDAO):

    def create_vak(self, vak: Vak, lesgever_id: int):
        lesgever = LesgeverModel.query.get(lesgever_id)

        if not lesgever:
            raise ItemNotFoundException(f"De lesgever met id {lesgever_id} kon niet in de databank gevonden worden")

        new_vak = VakModel(naam=vak.naam, lesgever=lesgever)

        db.session.add(new_vak)
        db.session.commit()

        vak.id = new_vak.id

    def get_vak(self, lesgever_id: int):
        vak = VakModel.query.get(lesgever_id)
        if not vak:
            raise ItemNotFoundException(f"De lesgever met id {lesgever_id} kon niet in de databank gevonden worden")

        return vak.to_domain_model()

    def getVakken(self, lesgever_id: int) -> list[Vak]:
        lesgever: LesgeverModel = LesgeverModel.query.get(ident=lesgever_id)

        if not lesgever:
            raise ItemNotFoundException(f"De lesgever met id {lesgever_id} kon niet in de databank gevonden worden")

        vakken: list[VakModel] = lesgever.vakken
        return [vak.to_domain_model() for vak in vakken]
