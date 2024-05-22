# test_edge_cases.py
import unittest
from datetime import datetime

from sqlmodel import SQLModel

from domain.logic import group, student, submission
from errors.database_errors import ItemNotFoundError
from tests.crud.test_main import get_db, test_engine


class TestEdgeCases(unittest.TestCase):
    def setUp(self) -> None:
        SQLModel.metadata.drop_all(test_engine)
        SQLModel.metadata.create_all(test_engine)
        self.session = next(get_db())

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
            submission.create_submission(
                self.session,
                stud.id,
                999,
                datetime.now(),
                b"",
                "test",
                skip_validation=True,
            )


if __name__ == "__main__":
    unittest.main()
