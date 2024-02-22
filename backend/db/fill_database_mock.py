from backend.db.implementation.SqlLesgeverDAO import SqlLesgeverDAO
from backend.db.implementation.SqlVakDAO import SqlVakDAO
from backend.db.interface.LesgeverDAO import LesgeverDAO
from backend.db.interface.VakDAO import VakDAO
from backend.domain.models.models import Lesgever, Vak
from backend.routes.index import app
from backend.routes.extentions import db

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        lesgeverDAO: LesgeverDAO = SqlLesgeverDAO()
        vakDAO: VakDAO = SqlVakDAO()

        # Maak nieuwe lesgevers aan.
        Gunnar = Lesgever(naam="Gunnar Brinkmann")
        Peter = Lesgever(naam="Peter Dawyndt")
        Eric = Lesgever(naam="Eric Laermans")

        # Voeg lesgevers toe aan de databank via de lesgever DAO
        lesgeverDAO.createLesgever(Gunnar)
        lesgeverDAO.createLesgever(Peter)
        lesgeverDAO.createLesgever(Eric)

        # Maak nieuwe vakken aan
        AD2 = Vak(naam="Algoritmen en Datastructuren II")
        AD3 = Vak(naam="Algoritmen en Datastructuren III")
        Computergebruik = Vak(naam="Computergebruik")
        ComputationeleBiologie = Vak(naam="Computationele Biologie")
        RAF = Vak(naam="Redeneren, Abstraheren en Formuleren")
        InformationSecurity = Vak(naam="Information Security")

        # Steek de vakken in de databank
        vakDAO.create_vak(AD2, Gunnar.id)
        vakDAO.create_vak(AD3, Gunnar.id)

        vakDAO.create_vak(Computergebruik, Peter.id)
        vakDAO.create_vak(ComputationeleBiologie, Peter.id)

        vakDAO.create_vak(RAF, Eric.id)
        vakDAO.create_vak(InformationSecurity, Eric.id)
