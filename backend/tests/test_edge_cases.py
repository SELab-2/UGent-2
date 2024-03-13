# test_edge_cases.py
import unittest
from datetime import datetime

from test_main import SessionLocal, test_engine

from db.errors.database_errors import ItemNotFoundError
from db.extensions import Base
from domain.logic import group, student, submission
from domain.models.SubmissionDataclass import SubmissionState


class TestEdgeCases(unittest.TestCase):
    def setUp(self) -> None:
        Base.metadata.drop_all(test_engine)
        Base.metadata.create_all(test_engine)
        self.session = SessionLocal()

    def tearDown(self) -> None:
        self.session.rollback()
        self.session.close()

    def test_add_student_to_non_existent_group(self) -> None:
        stud = student.create_student(self.session, "Test Student", "teststudent@gmail.com")
        with self.assertRaises(ItemNotFoundError):
            group.add_student_to_group(self.session, stud.id, 999)

    def test_create_submission_for_non_existent_project(self) -> None:
        stud = student.create_student(self.session, "Test Student", "teststudent@gmail.com")
        with self.assertRaises(ItemNotFoundError):
            submission.create_submission(self.session, stud.id, 999, "Test Message", SubmissionState.Pending,
                                         datetime.now())


if __name__ == "__main__":
    unittest.main()
