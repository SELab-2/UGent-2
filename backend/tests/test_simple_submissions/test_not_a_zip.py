import tempfile
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class NotAZipTest(unittest.TestCase):

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            zip_name="it_must_be_this_name.zip",
            sub_constraints=[],
        ),
        global_constraints=[],
    )

    temp_dir = tempfile.TemporaryDirectory()
    temp_dir_path = Path(temp_dir.name)

    @classmethod
    def setUpClass(cls) -> None:
        # Create a zip file
        zip_path = cls.temp_dir_path / "it_must_be_this_name.zip"
        zip_path.touch()
        cls.res = cls.submission_constraint.validate_constraint(cls.temp_dir_path)

    @classmethod
    def tearDownClass(cls) -> None:
        cls.temp_dir.cleanup()

    def test_not_a_zip(self) -> None:
        self.assertFalse(self.res.root_constraint_result.is_ok)

