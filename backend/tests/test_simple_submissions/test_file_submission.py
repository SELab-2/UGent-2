import tempfile
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint


class FileSubmissionConstraintValidationTest(unittest.TestCase):
    """
    This test case will test the validation of a file submission:
    submission.txt
    """

    submission_constraint = SubmissionConstraint(
        root_constraint=FileConstraint(
            name="submission.txt",
        ),
    )

    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_dir_path = Path(self.temp_dir.name)

        # create a file
        file_path = self.temp_dir_path / "submission.txt"
        file_path.touch()

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_file_submission(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        self.assertTrue(res.is_ok)  # The constraint should be satisfied because submission.txt is present


if __name__ == "__main__":
    unittest.main()
