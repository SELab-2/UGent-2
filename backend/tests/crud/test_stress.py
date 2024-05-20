# test_stress.py
import unittest
from datetime import datetime

from sqlmodel import SQLModel

from domain.logic import admin, course, group, project, student, submission, teacher
from tests.crud.test_main import get_db, test_engine


class TestStress(unittest.TestCase):
    def setUp(self) -> None:
        SQLModel.metadata.drop_all(test_engine)
        SQLModel.metadata.create_all(test_engine)
        self.session = next(get_db())

    def tearDown(self) -> None:
        self.session.rollback()
        self.session.close()

    def test_stress(self) -> None:
        # Create multiple instances of each entity
        for i in range(100):
            stud = student.create_student(self.session, f"Test Student {i}", f"teststudent{i}@gmail.com")
            subj = course.create_course(self.session, f"Test Course {i}")
            proj = project.create_project(
                self.session,
                subj.id,
                f"Test Project {i}",
                datetime.now(),
                False,
                "Test Description",
                '{"type": "SUBMISSION", "root_constraint": { "type": "ZIP", "zip_name": "submission.zip", '
                '"global_constraints": [], "sub_constraints": []}}',
                True,
                2,
                "",
            )
            grp = group.create_group(self.session, proj.id)
            subm = submission.create_submission(
                self.session,
                stud.id,
                grp.id,
                datetime.now(),
                b"",
                "test",
                skip_validation=True,
            )
            teach = teacher.create_teacher(self.session, f"Test Teacher {i}", f"testteacher{i}@gmail.com")
            adm = admin.create_admin(self.session, f"Test Admin {i}", f"testadmin{i}@gmail.com")

            # Perform operations on the entities
            course.add_student_to_course(self.session, stud.id, subj.id)
            group.add_student_to_group(self.session, stud.id, grp.id)
            course.add_teacher_to_course(self.session, teach.id, subj.id)

            # Assert the expected outcomes
            self.assertEqual(student.get_student(self.session, stud.id).id, stud.id)
            self.assertEqual(course.get_course(self.session, subj.id).id, subj.id)
            self.assertEqual(project.get_project(self.session, proj.id).id, proj.id)
            self.assertEqual(group.get_group(self.session, grp.id).id, grp.id)
            self.assertEqual(submission.get_submission(self.session, subm.id).id, subm.id)
            self.assertEqual(teacher.get_teacher(self.session, teach.id).id, teach.id)
            self.assertEqual(admin.get_admin(self.session, adm.id).id, adm.id)

        # Checks outside the loop
        self.assertEqual(len(student.get_all_students(self.session)), 100)
        self.assertEqual(len(course.get_all_courses(self.session)), 100)
        self.assertEqual(len(project.get_all_projects(self.session)), 100)
        self.assertEqual(len(group.get_all_groups(self.session)), 100)
        self.assertEqual(len(submission.get_all_submissions(self.session)), 100)
        self.assertEqual(len(teacher.get_all_teachers(self.session)), 100)
        self.assertEqual(len(admin.get_all_admins(self.session)), 100)
