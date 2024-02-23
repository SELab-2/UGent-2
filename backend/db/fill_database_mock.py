from backend.db.extentions import db
from backend.db.implementation.SqlLesgeverDAO import SqlTeacherDAO
from backend.db.implementation.SqlVakDAO import SqlSubjectDAO
from backend.db.interface.SubjectDAO import SubjectDAO
from backend.db.interface.TeacherDAO import TeacherDAO
from backend.domain.models.models import Subject, Teacher
from backend.routes.index import app

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

        teacher_dao: TeacherDAO = SqlTeacherDAO()
        subject_dao: SubjectDAO = SqlSubjectDAO()

        # Maak nieuwe lesgevers aan.
        Gunnar = Teacher(name="Gunnar Brinkmann")
        Peter = Teacher(name="Peter Dawyndt")
        Eric = Teacher(name="Eric Laermans")

        # Voeg lesgevers toe aan de databank via de teacher DAO
        teacher_dao.create_teacher(Gunnar)
        teacher_dao.create_teacher(Peter)
        teacher_dao.create_teacher(Eric)

        # Maak nieuwe subjects aan
        AD2 = Subject(name="Algoritmen en Datastructuren II")
        AD3 = Subject(name="Algoritmen en Datastructuren III")
        Computergebruik = Subject(name="Computergebruik")
        ComputationeleBiologie = Subject(name="Computationele Biologie")
        RAF = Subject(name="Redeneren, Abstraheren en Formuleren")
        InformationSecurity = Subject(name="Information Security")

        # Steek de subjects in de databank
        subject_dao.create_subject(AD2, Gunnar.id)
        subject_dao.create_subject(AD3, Gunnar.id)

        subject_dao.create_subject(Computergebruik, Peter.id)
        subject_dao.create_subject(ComputationeleBiologie, Peter.id)

        subject_dao.create_subject(RAF, Eric.id)
        subject_dao.create_subject(InformationSecurity, Eric.id)
