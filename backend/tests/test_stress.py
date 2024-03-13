# test_stress.py
import unittest
from datetime import datetime

from test_main import SessionLocal, test_engine

from db.extensions import Base
from domain.logic import admin, group, project, student, subject, submission, teacher
from domain.models.SubmissionDataclass import SubmissionState


class TestStress(unittest.TestCase):
    def setUp(self) -> None:
        Base.metadata.drop_all(test_engine)
        Base.metadata.create_all(test_engine)
        self.session = SessionLocal()

    def tearDown(self) -> None:
        self.session.rollback()
        self.session.close()

    def test_stress(self) -> None:
        # Create multiple instances of each entity
        for i in range(100):
            stud = student.create_student(self.session, f"Test Student {i}", f"teststudent{i}@gmail.com")
            subj = subject.create_subject(self.session, f"Test Subject {i}")
            proj = project.create_project(self.session, subj.id, f"Test Project {i}", datetime.now(), False,
                                          "Test Description",
                                          "Test Requirements", True, 2)
            grp = group.create_group(self.session, proj.id)
            subm = submission.create_submission(self.session, stud.id, grp.id, "Test Message", SubmissionState.Pending,
                                                datetime.now())
            teach = teacher.create_teacher(self.session, f"Test Teacher {i}", f"testteacher{i}@gmail.com")
            adm = admin.create_admin(self.session, f"Test Admin {i}", f"testadmin{i}@gmail.com")

            # Perform operations on the entities
            subject.add_student_to_subject(self.session, stud.id, subj.id)
            group.add_student_to_group(self.session, stud.id, grp.id)
            subject.add_teacher_to_subject(self.session, teach.id, subj.id)

            # Assert the expected outcomes
            self.assertEqual(student.get_student(self.session, stud.id).id, stud.id)
            self.assertEqual(subject.get_subject(self.session, subj.id).id, subj.id)
            self.assertEqual(project.get_project(self.session, proj.id).id, proj.id)
            self.assertEqual(group.get_group(self.session, grp.id).id, grp.id)
            self.assertEqual(submission.get_submission(self.session, subm.id).id, subm.id)
            self.assertEqual(teacher.get_teacher(self.session, teach.id).id, teach.id)
            self.assertEqual(admin.get_admin(self.session, adm.id).id, adm.id)

        # Checks outside the loop
        self.assertEqual(len(student.get_all_students(self.session)), 100)
        self.assertEqual(len(subject.get_all_subjects(self.session)), 100)
        self.assertEqual(len(project.get_all_projects(self.session)), 100)
        self.assertEqual(len(group.get_all_groups(self.session)), 100)
        self.assertEqual(len(submission.get_all_submissions(self.session)), 100)
        self.assertEqual(len(teacher.get_all_teachers(self.session)), 100)
        self.assertEqual(len(admin.get_all_admins(self.session)), 100)