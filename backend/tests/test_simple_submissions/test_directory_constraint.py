import tempfile
import typing
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.constraint_result import ConstraintResult
from domain.simple_submission_checks.constraints.directory_constraint import DirectoryConstraint
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.global_constraint import GlobalConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint
from tests.test_simple_submissions import create_directory_and_zip


class NestedDirectoryConstraintValidationTest(unittest.TestCase):
    """
    This test case will test the validation of a nested directory structure:
    submission.zip
    ├── dir1
    │   └── file1.txt
    └── dir2
        └── file2.txt
    """

    structure: typing.ClassVar = {
        "dir1": {"file1.txt": None},
        "dir2": {"file2.txt": None},
        # dir3 is missing
    }

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            zip_name="submission.zip",
            sub_constraints=[
                DirectoryConstraint(
                    directory_name="dir1",
                    sub_constraints=[FileConstraint(file_name="file1.txt")],
                ),
                DirectoryConstraint(
                    directory_name="dir2",
                    sub_constraints=[FileConstraint(file_name="file2.txt")],
                ),
                DirectoryConstraint(
                    directory_name="dir3",
                    sub_constraints=[],
                ),
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

    def test_dir1(self) -> None:
        """dir1 should be valid."""
        dir_1_sub_result = self.root_sub_results[0]
        self.assertTrue(dir_1_sub_result.is_ok)

    def test_dir2(self) -> None:
        """dir2 should be valid."""
        dir_2_sub_result = self.root_sub_results[1]
        self.assertTrue(dir_2_sub_result.is_ok)

    def test_non_existent_directory(self) -> None:
        """dir3 should not be valid."""
        dir_3_sub_result = self.root_sub_results[2]
        self.assertFalse(dir_3_sub_result.is_ok)

    def test_file1(self) -> None:
        """file1 should be valid."""
        dir_1_sub_result = self.root_sub_results[0]
        self.assertTrue(dir_1_sub_result.is_ok)
        file_1_result = dir_1_sub_result.sub_constraint_results[0]
        self.assertTrue(file_1_result.is_ok)

    def test_file2(self) -> None:
        """file1 should be valid."""
        dir_2_sub_result = self.root_sub_results[1]
        self.assertTrue(dir_2_sub_result.is_ok)
        file_2_result = dir_2_sub_result.sub_constraint_results[0]
        self.assertTrue(file_2_result.is_ok)


if __name__ == "__main__":
    unittest.main()
