from datetime import datetime

from psycopg2 import tz
from sqlalchemy.orm import sessionmaker

from db.extensions import Base, engine
from domain.logic.admin import create_admin
from domain.logic.group import add_student_to_group, create_group
from domain.logic.project import create_project
from domain.logic.student import create_student
from domain.logic.subject import add_student_to_subject, add_teacher_to_subject, create_subject
from domain.logic.teacher import create_teacher

if __name__ == "__main__":
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(autocommit=False, bind=engine)
    session = SessionLocal()

    # Create subjects
    objeprog = create_subject(session, name="Objectgericht Programmeren")
    algoritmen = create_subject(session, name="Algoritmen en Datastructuren")
    webtech = create_subject(session, name="Webtechnologie")

    # Create projects for subjects
    objprog_project = create_project(
        session=session,
        subject_id=objeprog.id,
        name="Flash Cards",
        archived=False,
        visible=True,
        description="Maak iets in JavaFX",
        requirements="Een zip bestand met Java-code",
        max_students=2,
        deadline=datetime(2024, 12, 31, 23, 59, 59, tzinfo=tz.LOCAL),
    )

    algo_project = create_project(
        session=session,
        subject_id=algoritmen.id,
        name="Sorteer Algoritmen Implementatie",
        archived=False,
        visible=True,
        description="Implementeer verschillende sorteeralgoritmen",
        requirements="Code in Python",
        max_students=3,
        deadline=datetime(2024, 11, 15, 23, 59, 59, tzinfo=tz.LOCAL),
    )

    web_project = create_project(
        session=session,
        subject_id=webtech.id,
        name="Webshop",
        archived=False,
        visible=True,
        description="Bouw een eenvoudige webshop",
        requirements="Gebruik van HTML, CSS, en JavaScript",
        max_students=4,
        deadline=datetime(2024, 10, 30, 23, 59, 59, tzinfo=tz.LOCAL),
    )

    # Create groups for projects
    groep1_objprog = create_group(session, objprog_project.id)
    groep2_algo = create_group(session, algo_project.id)
    groep3_web = create_group(session, web_project.id)

    # Create students
    student1 = create_student(session, "Lukas", "lukas@gmail.com")
    student2 = create_student(session, "Alberic", "alberic@gmail.com")
    student3 = create_student(session, "Matthias", "matthias@gmail.com")
    student4 = create_student(session, "Eva", "eva@gmail.com")
    student5 = create_student(session, "Emma", "emma@gmail.com")

    # Create teachers
    teacher1 = create_teacher(session, "Kris Coolsaet", "kris.coolsaet@ugent.be")
    teacher2 = create_teacher(session, "Sophie Devolder", "sophie.devolder@ugent.be")
    teacher3 = create_teacher(session, "Pieter-Jan De Smet", "pj.desmet@ugent.be")

    # Create admin
    admin = create_admin(session, "Admin", "admin@gmail.com")

    # Add teachers to subjects
    add_teacher_to_subject(session, teacher1.id, objeprog.id)
    add_teacher_to_subject(session, teacher2.id, algoritmen.id)
    add_teacher_to_subject(session, teacher3.id, webtech.id)

    add_student_to_subject(session, student1.id, objeprog.id)

    # Add students to groups
    add_student_to_group(session, student1.id, groep1_objprog.id)
    add_student_to_group(session, student2.id, groep1_objprog.id)
    add_student_to_group(session, student3.id, groep1_objprog.id)

    add_student_to_group(session, student4.id, groep2_algo.id)
    add_student_to_group(session, student5.id, groep2_algo.id)

    add_student_to_group(session, student1.id, groep3_web.id)
    add_student_to_group(session, student3.id, groep3_web.id)
    add_student_to_group(session, student5.id, groep3_web.id)

    session.commit()
