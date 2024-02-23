from backend.db.errors.database_errors import ItemNotFoundError
from backend.db.extentions import db
from backend.db.interface.LesgeverDAO import LesgeverDAO
from backend.db.models.models import Lesgever, LesgeverModel


class SqlLesgeverDAO(LesgeverDAO):

    def create_lesgever(self, lesgever: Lesgever):
        nieuwe_lesgever = LesgeverModel(naam=lesgever.naam)

        db.session.add(nieuwe_lesgever)
        db.session.commit()

        lesgever.id = nieuwe_lesgever.id

    def get_all_lesgevers(self) -> list[Lesgever]:
        lesgevers: list[LesgeverModel] = LesgeverModel.query.all()
        return [lesgever.to_domain_model() for lesgever in lesgevers]

    def get_lesgever(self, ident: int):
        lesgever: LesgeverModel = LesgeverModel.query.get(ident=ident)

        if not lesgever:
            raise ItemNotFoundError("Lesgever with given id not found.")

        return lesgever.to_domain_model()
