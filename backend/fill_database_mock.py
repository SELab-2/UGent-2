from datetime import datetime

from psycopg2 import tz
from sqlmodel import Session

from create_database_tables import initialize_tables
from db.extensions import engine
from db.models import CourseInput
from domain.logic.admin import create_admin
from domain.logic.course import add_student_to_course, add_teacher_to_course, create_course, update_course
from domain.logic.group import add_student_to_group, create_group
from domain.logic.project import create_project
from domain.logic.role_enum import Role
from domain.logic.student import create_student
from domain.logic.submission import create_submission
from domain.logic.teacher import create_teacher
from domain.logic.user import modify_user_roles


def fill_database_mock() -> None:
    with Session(engine) as session:
        initialize_tables(session, engine)

        # Create courses
        objeprog = create_course(session, name="Objectgericht Programmeren")
        algoritmen = create_course(session, name="Algoritmen en Datastructuren")
        webtech = create_course(session, name="Webtechnologie")
        funcprog = create_course(session, name="Haskell")

        # Create projects for courses
        objprog_project = create_project(
            session=session,
            course_id=objeprog.id,
            name="Flash Cards",
            archived=False,
            visible=True,
            description="Maak iets in JavaFX",
            requirements='{"type": "SUBMISSION", "root_constraint": { "type": "ZIP", "zip_name": "submission.zip", '
            '"global_constraints": [], "sub_constraints": []}}',
            max_students=3,
            deadline=datetime(2024, 12, 31, 23, 59, 59, tzinfo=tz.LOCAL),
            dockerfile="",
        )

        create_project(
            session=session,
            course_id=objeprog.id,
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
            requirements='{"type": "SUBMISSION", "root_constraint": { "type": "ZIP", "zip_name": "submission.zip", '
            '"global_constraints": [], "sub_constraints": []}}',
            max_students=999,
            deadline=datetime(2024, 2, 29, 00, tzinfo=tz.LOCAL),
            dockerfile="",
        )

        algo_project = create_project(
            session=session,
            course_id=algoritmen.id,
            name="Sorteer Algoritmen Implementatie",
            archived=False,
            visible=True,
            description="Implementeer verschillende sorteeralgoritmen",
            requirements='{"type": "SUBMISSION", "root_constraint": { "type": "ZIP", "zip_name": "submission.zip", '
            '"global_constraints": [], "sub_constraints": []}}',
            max_students=1,
            deadline=datetime(2024, 11, 15, 23, 59, 59, tzinfo=tz.LOCAL),
            dockerfile="",
        )

        web_project = create_project(
            session=session,
            course_id=webtech.id,
            name="Webshop",
            archived=False,
            visible=True,
            description="Bouw een eenvoudige webshop",
            requirements="""{
                "type": "SUBMISSION",
                "root_constraint": {
                    "type": "ZIP",
                    "zip_name": "project.zip",
                    "global_constraints": [
                        {
                            "type": "EXTENSION_NOT_PRESENT",
                            "extension": ".exe"
                        },
                        {
                            "type": "NOT_PRESENT",
                            "file_or_directory_name": "test.class"
                        }
                    ],
                    "sub_constraints": [
                    {
                        "type": "DIRECTORY",
                        "directory_name": "src",
                        "sub_constraints": [
                        {
                            "type": "FILE",
                            "file_name": "main.py"
                        },
                        {
                            "type": "DIRECTORY",
                            "directory_name": "utils",
                            "sub_constraints": [
                            {
                                "type": "FILE",
                                "file_name": "helper.py"
                            },
                            {
                                "type": "NOT_PRESENT",
                                "file_or_directory_name": "extra_file.txt"
                            }
                            ]
                        }
                        ]
                    },
                    {
                        "type": "DIRECTORY",
                        "directory_name": "tests",
                        "sub_constraints": [
                        {
                            "type": "FILE",
                            "file_name": "test_main.py"
                        }
                        ]
                    },
                    {
                        "type": "FILE",
                        "file_name": "README.md"
                    },
                    {
                        "type": "FILE",
                        "file_name": ".gitignore"
                    },
                    {
                        "type": "NOT_PRESENT",
                        "file_or_directory_name": "dist"
                    },
                    {
                        "type": "EXTENSION_NOT_PRESENT",
                        "extension": ".log"
                    }
                    ]
                }
            }""",
            max_students=4,
            deadline=datetime(2024, 10, 30, 23, 59, 59, tzinfo=tz.LOCAL),
            dockerfile="",
        )

        haskell_project = create_project(
            session=session,
            course_id=funcprog.id,
            name="RPG Game in Haskell",
            archived=False,
            visible=True,
            description="Maak een RPG game in Haskell!",
            requirements='{"type": "SUBMISSION", "root_constraint": { "type": "ZIP", "zip_name": "submission.zip", '
            '"global_constraints": [], "sub_constraints": []}}',
            max_students=1,
            deadline=datetime(2023, 7, 17, 22, 33, 44, tzinfo=tz.LOCAL),
            dockerfile="",
        )

        # Create groups for projects
        groep1_objprog = create_group(session, objprog_project.id)
        groep2_objprog = create_group(session, objprog_project.id)
        groep3_objprog = create_group(session, objprog_project.id)
        create_group(session, objprog_project.id)
        groep1_algo = create_group(session, algo_project.id)
        groep2_algo = create_group(session, algo_project.id)
        groep3_algo = create_group(session, algo_project.id)
        groep4_algo = create_group(session, algo_project.id)
        groep5_algo = create_group(session, algo_project.id)
        groep6_algo = create_group(session, algo_project.id)
        groep7_algo = create_group(session, algo_project.id)
        groep8_algo = create_group(session, algo_project.id)
        groep1_web = create_group(session, web_project.id)
        create_group(session, web_project.id)
        groep1funcprog = create_group(session, haskell_project.id)
        groep2funcprog = create_group(session, haskell_project.id)
        groep3funcprog = create_group(session, haskell_project.id)
        groep4funcprog = create_group(session, haskell_project.id)
        create_group(session, haskell_project.id)  # lege groep

        # Create students
        student1 = create_student(session, "Lukas", "lukas.barragantorres@ugent.be")
        student2 = create_student(session, "Alberic", "alberic.loos@ugent.be")
        student3 = create_student(session, "Matthias", "matseghe.seghers@ugent.be")
        student4 = create_student(session, "Ruben", "ruben.vandamme@ugent.be")
        student5 = create_student(session, "Emma", "emmavdwa.vandewalle@ugent.be")
        student6 = create_student(session, "Robbe", "robbe.vandekeere@ugent.be")
        student7 = create_student(session, "Stef", "stef.osse@ugent.be")
        student8 = create_student(session, "Mathieu", "mathieu.strypsteen@ugent.be")

        modify_user_roles(session, student7.id, [Role.STUDENT, Role.ADMIN, Role.TEACHER])

        # Create teachers
        teacher1 = create_teacher(session, "Kris Coolsaet", "kris.coolsaet@ugent.be")
        teacher2 = create_teacher(session, "Sophie Devolder", "sophie.devolder@ugent.be")
        teacher3 = create_teacher(session, "Pieter-Jan De Smet", "pj.desmet@ugent.be")

        # Create admin
        create_admin(session, "Admin", "admin@gmail.com")

        # Add teachers to courses
        add_teacher_to_course(session, teacher1.id, objeprog.id)
        add_teacher_to_course(session, teacher2.id, algoritmen.id)
        add_teacher_to_course(session, teacher3.id, webtech.id)
        add_teacher_to_course(session, teacher3.id, objeprog.id)

        # Add students to courses

        # noinspection DuplicatedCode
        add_student_to_course(session, student1.id, objeprog.id)
        add_student_to_course(session, student2.id, objeprog.id)
        add_student_to_course(session, student3.id, objeprog.id)
        add_student_to_course(session, student4.id, objeprog.id)
        add_student_to_course(session, student5.id, objeprog.id)
        add_student_to_course(session, student6.id, objeprog.id)
        add_student_to_course(session, student7.id, objeprog.id)
        add_student_to_course(session, student8.id, objeprog.id)

        add_student_to_course(session, student1.id, algoritmen.id)
        add_student_to_course(session, student2.id, algoritmen.id)
        add_student_to_course(session, student3.id, algoritmen.id)
        add_student_to_course(session, student4.id, algoritmen.id)
        add_student_to_course(session, student5.id, algoritmen.id)
        # noinspection DuplicatedCode
        add_student_to_course(session, student6.id, algoritmen.id)
        add_student_to_course(session, student7.id, algoritmen.id)
        add_student_to_course(session, student8.id, algoritmen.id)

        add_student_to_course(session, student1.id, webtech.id)
        add_student_to_course(session, student2.id, webtech.id)
        add_student_to_course(session, student3.id, webtech.id)
        add_student_to_course(session, student4.id, webtech.id)
        add_student_to_course(session, student5.id, webtech.id)
        add_student_to_course(session, student7.id, webtech.id)  # 6 en 8 zullen assistent zijn bij dit vak

        add_student_to_course(session, student2.id, funcprog.id)
        add_student_to_course(session, student4.id, funcprog.id)
        add_student_to_course(session, student6.id, funcprog.id)
        add_student_to_course(session, student8.id, funcprog.id)

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
        add_student_to_group(session, student5.id, groep2_algo.id)
        add_student_to_group(session, student6.id, groep3_algo.id)
        # noinspection DuplicatedCode
        add_student_to_group(session, student1.id, groep4_algo.id)
        add_student_to_group(session, student2.id, groep5_algo.id)
        add_student_to_group(session, student3.id, groep6_algo.id)
        add_student_to_group(session, student8.id, groep7_algo.id)
        add_student_to_group(session, student7.id, groep8_algo.id)

        add_student_to_group(session, student1.id, groep1_web.id)
        add_student_to_group(session, student3.id, groep1_web.id)
        add_student_to_group(session, student5.id, groep1_web.id)

        add_student_to_group(session, student2.id, groep1funcprog.id)
        add_student_to_group(session, student4.id, groep2funcprog.id)
        add_student_to_group(session, student6.id, groep3funcprog.id)
        add_student_to_group(session, student8.id, groep4funcprog.id)

        # Create submissions (one per group)
        create_submission(
            session=session,
            student_id=student1.id,
            group_id=groep1_objprog.id,
            date_time=datetime(2024, 3, 22, 22, 55, 3, tzinfo=tz.LOCAL),
            file_content=b"TEST1",
            original_filename="flashcards.zip",
            skip_validation=True,
        )

        create_submission(
            session=session,
            student_id=student5.id,
            group_id=groep2_objprog.id,
            date_time=datetime(2024, 3, 22, 22, 57, 34, tzinfo=tz.LOCAL),
            file_content=b"TEST2",
            original_filename="flashcards.zip",
            skip_validation=True,
        )

        create_submission(
            session=session,
            student_id=student8.id,
            group_id=groep3_objprog.id,
            date_time=datetime(2024, 3, 22, 22, 59, 17, tzinfo=tz.LOCAL),
            file_content=b"TEST3",
            original_filename="flashcards.zip",
            skip_validation=True,
        )

        create_submission(
            session=session,
            student_id=student4.id,
            group_id=groep1_algo.id,
            date_time=datetime(2024, 3, 21, 7, 59, 13, tzinfo=tz.LOCAL),
            file_content=b"TEST4",
            original_filename="sorteer_algoritmen.py",
            skip_validation=True,
        )

        create_submission(
            session=session,
            student_id=student2.id,
            group_id=groep5_algo.id,
            date_time=datetime(2024, 2, 1, 12, 20, 45, tzinfo=tz.LOCAL),
            file_content=b"TEST5",
            original_filename="sorteer_algoritmen.py",
            skip_validation=True,
        )

        create_submission(
            session=session,
            student_id=student3.id,
            group_id=groep6_algo.id,
            date_time=datetime(2024, 3, 22, 23, 57, 34, tzinfo=tz.LOCAL),
            file_content=b"TEST6",
            original_filename="sorteer_algoritmen.py",
            skip_validation=True,
        )

        create_submission(
            session=session,
            student_id=student7.id,
            group_id=groep8_algo.id,
            date_time=datetime(2024, 3, 22, 22, 19, 0, tzinfo=tz.LOCAL),
            file_content=b"TEST7",
            original_filename="sorteer_algoritmen.py",
            skip_validation=True,
        )

        create_submission(
            session=session,
            student_id=student2.id,
            group_id=groep1funcprog.id,
            date_time=datetime(2023, 7, 16, 23, 0, 0, tzinfo=tz.LOCAL),
            file_content=b"TEST8",
            original_filename="RPG.zip",
            skip_validation=True,
        )

        create_submission(
            session=session,
            student_id=student8.id,
            group_id=groep4funcprog.id,
            date_time=datetime(2023, 7, 18, 21, 2, 5, tzinfo=tz.LOCAL),
            file_content=b"TEST9",
            original_filename="fungame.zip",
            skip_validation=True,
        )

        # make assistants
        modify_user_roles(session, student4.id, [Role.TEACHER])
        add_teacher_to_course(session, student4.id, webtech.id)

        modify_user_roles(session, student8.id, [Role.TEACHER])
        add_teacher_to_course(session, student8.id, webtech.id)

        modify_user_roles(session, student6.id, [Role.TEACHER])
        add_teacher_to_course(session, student6.id, funcprog.id)

        # Archive a course
        update_course(session, funcprog.id, CourseInput(name="Functioneel Programmeren", archived=True))

        session.commit()
        session.close()


if __name__ == "__main__":
    fill_database_mock()
