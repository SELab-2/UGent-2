from datetime import datetime

from psycopg2 import tz
from sqlmodel import Session

from create_database_tables import initialize_tables
from db.extensions import engine
from db.models import SubmissionState
from domain.logic.admin import create_admin
from domain.logic.group import add_student_to_group, create_group
from domain.logic.project import create_project
from domain.logic.role_enum import Role
from domain.logic.student import create_student
from domain.logic.subject import add_student_to_subject, add_teacher_to_subject, create_subject
from domain.logic.submission import create_submission
from domain.logic.teacher import create_teacher
from domain.logic.user import modify_user_roles

if __name__ == "__main__":
    with Session(engine) as session:
        initialize_tables(session, engine)

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
            requirements='{"type": "zip_constraint", "name": "submission.zip", "sub_constraints": []}',
            max_students=3,
            deadline=datetime(2024, 12, 31, 23, 59, 59, tzinfo=tz.LOCAL),
        )

        objprog_project_2 = create_project(
            session=session,
            subject_id=objeprog.id,
            name="Schaakklok",
            archived=True,
            visible=True,
            description="Een wedstrijdklok is een apparaat waarbij in één behuizing twee uurwerken zijn aangebracht "
            "zodanig"
            "dat er slechts één tegelijk kan lopen. Een wedstrijdklok wordt gebruikt bij een bordspel voor"
            "twee spelers om de bedenktijd te meten. Een speler moet een aantal zetten binnen een bepaalde"
            "tijd doen, of alle zetten binnen de aangegeven tijd, of eerst een aantal zetten binnen een"
            "bepaalde tijd en de resterende zetten binnen een bepaalde tijd. Een speler die zijn tijd"
            'overschrijdt, verliest de partij. Hij ging "door zijn vlag".\n\n\n'
            "Een wedstrijdklok kan worden gebruikt bij dammen, go, schaken en andere bordspellen."
            "Men kan dus ook van schaakklok, damklok, goklok of iets anders spreken, maar het gaat om"
            "hetzelfde apparaat en wedstrijdklok is de gebruikelijke benaming.",
            requirements='{"type": "file_constraint", "name": "klok.java"}',
            max_students=999,
            deadline=datetime(2024, 2, 29, 00, tzinfo=tz.LOCAL),
        )

        algo_project = create_project(
            session=session,
            subject_id=algoritmen.id,
            name="Sorteer Algoritmen Implementatie",
            archived=False,
            visible=True,
            description="Implementeer verschillende sorteeralgoritmen",
            requirements='{"type": "file_constraint", "name": "sort.py"}',
            max_students=1,
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
        groep2_objprog = create_group(session, objprog_project.id)
        groep3_objprog = create_group(session, objprog_project.id)
        groep4_objprog = create_group(session, objprog_project.id)  # empty group
        groep1_algo = create_group(session, algo_project.id)
        groep2_algo = create_group(session, algo_project.id)
        groep3_algo = create_group(session, algo_project.id)
        groep4_algo = create_group(session, algo_project.id)
        groep5_algo = create_group(session, algo_project.id)
        groep6_algo = create_group(session, algo_project.id)
        groep7_algo = create_group(session, algo_project.id)
        groep8_algo = create_group(session, algo_project.id)
        groep1_web = create_group(session, web_project.id)
        groep2_web = create_group(session, web_project.id)  # empty group

        # Create students
        student1 = create_student(session, "Lukas", "Lukas.BarraganTorres@UGent.be")
        student2 = create_student(session, "Alberic", "Alberic.Loos@UGent.be")
        student3 = create_student(session, "Matthias", "matseghe.Seghers@UGent.be")
        student4 = create_student(session, "Ruben", "Ruben.Vandamme@UGent.be")
        student5 = create_student(session, "Emma", "emmavdwa.Vandewalle@UGent.be")
        student6 = create_student(session, "Robbe", "Robbe.VandeKeere@UGent.be")
        student7 = create_student(session, "Stef", "Stef.Osse@UGent.be")
        student8 = create_student(session, "Mathieu", "Mathieu.Strypsteen@UGent.be")

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
        add_teacher_to_subject(session, teacher3.id, objeprog.id)

        # Add students to subjects

        # noinspection DuplicatedCode
        add_student_to_subject(session, student1.id, objeprog.id)
        add_student_to_subject(session, student2.id, objeprog.id)
        add_student_to_subject(session, student3.id, objeprog.id)
        add_student_to_subject(session, student4.id, objeprog.id)
        add_student_to_subject(session, student5.id, objeprog.id)
        add_student_to_subject(session, student6.id, objeprog.id)
        add_student_to_subject(session, student7.id, objeprog.id)
        add_student_to_subject(session, student8.id, objeprog.id)

        add_student_to_subject(session, student1.id, algoritmen.id)
        add_student_to_subject(session, student2.id, algoritmen.id)
        add_student_to_subject(session, student3.id, algoritmen.id)
        # noinspection DuplicatedCode
        add_student_to_subject(session, student4.id, algoritmen.id)
        add_student_to_subject(session, student5.id, algoritmen.id)
        add_student_to_subject(session, student6.id, algoritmen.id)
        add_student_to_subject(session, student7.id, algoritmen.id)
        add_student_to_subject(session, student8.id, algoritmen.id)

        add_student_to_subject(session, student1.id, webtech.id)
        add_student_to_subject(session, student2.id, webtech.id)
        add_student_to_subject(session, student3.id, webtech.id)
        add_student_to_subject(session, student5.id, webtech.id)  # 4 en 8 zullen assistent zijn bij dit vak
        add_student_to_subject(session, student6.id, webtech.id)
        add_student_to_subject(session, student7.id, webtech.id)

        # Add students to groups

        # noinspection DuplicatedCode
        add_student_to_group(session, student1.id, groep1_objprog.id)
        add_student_to_group(session, student2.id, groep1_objprog.id)
        add_student_to_group(session, student3.id, groep1_objprog.id)
        add_student_to_group(session, student4.id, groep2_objprog.id)
        add_student_to_group(session, student5.id, groep2_objprog.id)
        add_student_to_group(session, student6.id, groep3_objprog.id)
        add_student_to_group(session, student7.id, groep3_objprog.id)
        add_student_to_group(session, student8.id, groep3_objprog.id)

        add_student_to_group(session, student4.id, groep1_algo.id)
        # noinspection DuplicatedCode
        add_student_to_group(session, student5.id, groep2_algo.id)
        add_student_to_group(session, student6.id, groep3_algo.id)
        add_student_to_group(session, student1.id, groep4_algo.id)
        add_student_to_group(session, student2.id, groep5_algo.id)
        add_student_to_group(session, student3.id, groep6_algo.id)
        add_student_to_group(session, student8.id, groep7_algo.id)
        add_student_to_group(session, student7.id, groep8_algo.id)

        add_student_to_group(session, student1.id, groep1_web.id)
        add_student_to_group(session, student3.id, groep1_web.id)
        add_student_to_group(session, student5.id, groep1_web.id)

        # Create submissions (one per group)
        create_submission(
            session=session,
            student_id=student1.id,
            group_id=groep1_objprog.id,
            message="Eerste versie",
            state=SubmissionState.Rejected,
            date_time=datetime(2024, 3, 22, 22, 55, 3, tzinfo=tz.LOCAL),
            filename="flashcards.zip",
        )

        create_submission(
            session=session,
            student_id=student5.id,
            group_id=groep2_objprog.id,
            message="",
            state=SubmissionState.Pending,
            date_time=datetime(2024, 3, 22, 22, 57, 34, tzinfo=tz.LOCAL),
            filename="flashcards.zip",
        )

        create_submission(
            session=session,
            student_id=student8.id,
            group_id=groep3_objprog.id,
            message="blablabla",
            state=SubmissionState.Approved,
            date_time=datetime(2024, 3, 22, 22, 59, 17, tzinfo=tz.LOCAL),
            filename="flashcards.zip",
        )

        create_submission(
            session=session,
            student_id=student4.id,
            group_id=groep1_algo.id,
            message="Optimalisatie + enkele bug fixes",
            state=SubmissionState.Approved,
            date_time=datetime(2024, 3, 21, 7, 59, 13, tzinfo=tz.LOCAL),
            filename="sorteer_algoritmen.py",
        )

        create_submission(
            session=session,
            student_id=student2.id,
            group_id=groep5_algo.id,
            message="Klaar is kees!",
            state=SubmissionState.Approved,
            date_time=datetime(2024, 2, 1, 12, 20, 45, tzinfo=tz.LOCAL),
            filename="sorteer_algoritmen.py",
        )

        create_submission(
            session=session,
            student_id=student3.id,
            group_id=groep6_algo.id,
            message="Nog wat werk",
            state=SubmissionState.Rejected,
            date_time=datetime(2024, 3, 22, 23, 57, 34, tzinfo=tz.LOCAL),
            filename="sorteer_algoritmen.py",
        )

        create_submission(
            session=session,
            student_id=student7.id,
            group_id=groep8_algo.id,
            message="",
            state=SubmissionState.Rejected,
            date_time=datetime(2024, 3, 22, 22, 19, 0, tzinfo=tz.LOCAL),
            filename="sorteer_algoritmen.py",
        )

        # make assistants
        modify_user_roles(session, student4.id, [Role.TEACHER])
        add_teacher_to_subject(session, student4.id, webtech.id)

        modify_user_roles(session, student8.id, [Role.TEACHER])
        add_teacher_to_subject(session, student8.id, webtech.id)

        session.commit()
        session.close()
