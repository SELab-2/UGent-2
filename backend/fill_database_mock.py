import sys

from app import app
from db.extensions import db
from db.implementation.SqlLesgeverDAO import SqlTeacherDAO
from db.implementation.SqlVakDAO import SqlSubjectDAO
from db.interface.SubjectDAO import SubjectDAO
from db.interface.TeacherDAO import TeacherDAO
from domain.models.SubjectDataclass import SubjectDataclass
from domain.models.TeacherDataclass import TeacherDataclass

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        sys.exit()  # De DAO's moeten nog aangemaakt worden
        teacher_dao: TeacherDAO = SqlTeacherDAO()
        subject_dao: SubjectDAO = SqlSubjectDAO()

        # Maak nieuwe lesgevers aan.
        Gunnar = TeacherDataclass(name="Gunnar Brinkmann")
        Peter = TeacherDataclass(name="Peter Dawyndt")
        Eric = TeacherDataclass(name="Eric Laermans")

        # Voeg lesgevers toe aan de databank via de teacher DAO
        teacher_dao.create_teacher(Gunnar)
        teacher_dao.create_teacher(Peter)
        teacher_dao.create_teacher(Eric)

        # Maak nieuwe subjects aan
        AD2 = SubjectDataclass(name="Algoritmen en Datastructuren II")
        AD3 = SubjectDataclass(name="Algoritmen en Datastructuren III")
        Computergebruik = SubjectDataclass(name="Computergebruik")
        ComputationeleBiologie = SubjectDataclass(name="Computationele Biologie")
        RAF = SubjectDataclass(name="Redeneren, Abstraheren en Formuleren")
        InformationSecurity = SubjectDataclass(name="Information Security")

        # Steek de subjects in de databank
        subject_dao.create_subject(AD2, Gunnar.id)
        subject_dao.create_subject(AD3, Gunnar.id)

        subject_dao.create_subject(Computergebruik, Peter.id)
        subject_dao.create_subject(ComputationeleBiologie, Peter.id)

        subject_dao.create_subject(RAF, Eric.id)
        subject_dao.create_subject(InformationSecurity, Eric.id)
