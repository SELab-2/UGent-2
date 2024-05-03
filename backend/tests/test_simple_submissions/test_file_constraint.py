import tempfile
import typing
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.constraint_result import ConstraintResult
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.global_constraint import GlobalConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint
from tests.test_simple_submissions import create_directory_and_zip


class FileConstraintTest(unittest.TestCase):

    structure: typing.ClassVar = {
        "file1.txt": None,
    }

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            zip_name="submission.zip",
            sub_constraints=[
                FileConstraint(file_name="file1.txt"),
                FileConstraint(file_name="file2.txt"),
            ],
        ),
        global_constraint=GlobalConstraint(sub_constraints=[]),
    )

    temp_dir = tempfile.TemporaryDirectory()
    temp_dir_path = Path(temp_dir.name)

    @classmethod
    def setUpClass(cls) -> None:
        create_directory_and_zip(cls.structure, cls.temp_dir_path, "submission")
        res: ConstraintResult = cls.submission_constraint.validate_constraint(cls.temp_dir_path)
        cls.root_sub_results = res.root_constraint_result.sub_constraint_results

    @classmethod
    def tearDownClass(cls) -> None:
        cls.temp_dir.cleanup()

    def test_file1_present(self) -> None:
        file1_res = self.root_sub_results[0]
        self.assertTrue(file1_res.is_ok)

    def test_file2_not_present(self) -> None:
        file2_res = self.root_sub_results[1]
        self.assertFalse(file2_res.is_ok)

