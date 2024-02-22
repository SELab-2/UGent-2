from backend.db.errors.database_errors import ItemNotFoundException
from backend.db.interface.LesgeverDAO import LesgeverDAO
from backend.db.models.models import Lesgever, LesgeverModel
from backend.routes.extentions import db


class SqlLesgeverDAO(LesgeverDAO):

    def createLesgever(self, lesgever: Lesgever):
        nieuwe_lesgever = LesgeverModel(naam=lesgever.naam)

        db.session.add(nieuwe_lesgever)
        db.session.commit()

        lesgever.id = nieuwe_lesgever.id

    def getAllLesgevers(self) -> list[Lesgever]:
        lesgevers: list[LesgeverModel] = LesgeverModel.query.all()
        return [l.to_domain_model() for l in lesgevers]

    def getLesgever(self, ident: int):
        lesgever: LesgeverModel = LesgeverModel.query.get(ident=ident)

        if not lesgever:
            raise ItemNotFoundException("Lesgever with given id not found.")

        return lesgever.to_domain_model()
