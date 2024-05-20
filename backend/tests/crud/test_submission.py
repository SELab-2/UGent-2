# test_submission.py
import unittest
from datetime import datetime

from sqlmodel import SQLModel

from domain.logic.course import create_course
from domain.logic.group import create_group
from domain.logic.project import create_project
from domain.logic.student import create_student
from domain.logic.submission import (
    create_submission,
    get_all_submissions,
    get_submission,
    get_submissions_of_group,
    get_submissions_of_student,
)
from tests.crud.test_main import get_db, test_engine


class TestSubmission(unittest.TestCase):
    def setUp(self) -> None:
        SQLModel.metadata.drop_all(test_engine)
        SQLModel.metadata.create_all(test_engine)
        self.session = next(get_db())

    def tearDown(self) -> None:
        self.session.rollback()
        self.session.close()

    def test_create_and_get_submission(self) -> None:
        student = create_student(self.session, "Test Student", "teststudent@gmail.com")
        course = create_course(self.session, "Test Course")
        project = create_project(
            self.session,
            course.id,
            "Test Project",
            datetime.now(),
            False,
            "Test Description",
            '{"type": "SUBMISSION", "root_constraint": { "type": "ZIP", "zip_name": "submission.zip", '
            '"global_constraints": [], "sub_constraints": []}}',
            True,
            2,
            "",
        )
        group = create_group(self.session, project.id)
        submission = create_submission(
            self.session,
            student.id,
            group.id,
            datetime.now(),
            b"",
            "test",
            skip_validation=True,
        )
        retrieved_submission = get_submission(self.session, submission.id)
        self.assertEqual(submission.id, retrieved_submission.id)

    def test_get_all_submissions(self) -> None:
        student1 = create_student(self.session, "Test Student 1", "teststudent1@gmail.com")
        student2 = create_student(self.session, "Test Student 2", "teststudent2@gmail.com")
        course = create_course(self.session, "Test Course")
        project = create_project(
            self.session,
            course.id,
            "Test Project",
            datetime.now(),
            False,
            "Test Description",
            '{"type": "SUBMISSION", "root_constraint": { "type": "ZIP", "zip_name": "submission.zip", '
            '"global_constraints": [], "sub_constraints": []}}',
            True,
            2,
            "",
        )
        group = create_group(self.session, project.id)
        create_submission(self.session, student1.id, group.id, datetime.now(), b"", "test", skip_validation=True)
        create_submission(self.session, student2.id, group.id, datetime.now(), b"", "test", skip_validation=True)
        self.assertEqual(len(get_all_submissions(self.session)), 2)

    def test_get_submissions_of_student(self) -> None:
        student = create_student(self.session, "Test Student", "teststudent@gmail.com")
        course = create_course(self.session, "Test Course")
        project = create_project(
            self.session,
            course.id,
            "Test Project",
            datetime.now(),
            False,
            "Test Description",
            '{"type": "SUBMISSION", "root_constraint": { "type": "ZIP", "zip_name": "submission.zip", '
            '"global_constraints": [], "sub_constraints": []}}',
            True,
            2,
            "",
        )
        group = create_group(self.session, project.id)
        create_submission(self.session, student.id, group.id, datetime.now(), b"", "test", skip_validation=True)
        create_submission(self.session, student.id, group.id, datetime.now(), b"", "test", skip_validation=True)
        submissions_of_student = get_submissions_of_student(self.session, student.id)
        self.assertEqual(len(submissions_of_student), 2)

    def test_get_submissions_of_group(self) -> None:
        student1 = create_student(self.session, "Test Student 1", "teststudent1@gmail.com")
        student2 = create_student(self.session, "Test Student 2", "teststudent2@gmail.com")
        course = create_course(self.session, "Test Course")
        project = create_project(
            self.session,
            course.id,
            "Test Project",
            datetime.now(),
            False,
            "Test Description",
            '{"type": "SUBMISSION", "root_constraint": { "type": "ZIP", "zip_name": "submission.zip", '
            '"global_constraints": [], "sub_constraints": []}}',
            True,
            2,
            "",
        )
        group = create_group(self.session, project.id)
        create_submission(self.session, student1.id, group.id, datetime.now(), b"", "test", skip_validation=True)
        create_submission(self.session, student2.id, group.id, datetime.now(), b"", "test", skip_validation=True)
        submissions_of_group = get_submissions_of_group(self.session, group.id)
        self.assertEqual(len(submissions_of_group), 2)


if __name__ == "__main__":
    unittest.main()
