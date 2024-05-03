import tempfile
import typing
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.constraint_result import ConstraintResult
from domain.simple_submission_checks.constraints.directory_constraint import DirectoryConstraint
from domain.simple_submission_checks.constraints.global_constraint import GlobalConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint
from tests.test_simple_submissions import create_directory_and_zip


class NotPresentConstraintValidationTest(unittest.TestCase):
    """
    This test case will test the validation of a directory structure:
    submission.zip
    ├── dir1
    │   └── file1.txt
    ├── bible.txt
    └── dir2
        └── file2.txt

    """

    structure: typing.ClassVar = {
        "dir1": {"file1.txt": None},
        "bible.txt": None,
        "dir2": {"file2.txt": None},
    }

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            zip_name="submission.zip",
            sub_constraints=[
                NotPresentConstraint(file_or_directory_name="dir3"),  # dir3 is not present, should pass
                NotPresentConstraint(file_or_directory_name="bible.txt"),  # present, should fail
                DirectoryConstraint(
                    directory_name="dir1",
                    sub_constraints=[NotPresentConstraint(file_or_directory_name="file1.txt")],
                ),
            ],
        ),
        global_constraint=GlobalConstraint(constraints=[]),
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

    def test_not_present_dir(self) -> None:
        """dir3 should not be present."""
        dir_3_sub_result = self.root_sub_results[0]
        self.assertTrue(dir_3_sub_result.is_ok)

    def test_not_present_file(self) -> None:
        """bible.txt should not be present."""
        bible_sub_result = self.root_sub_results[1]
        self.assertFalse(bible_sub_result.is_ok)

    def test_not_present_dir1_file(self) -> None:
        """file1.txt should not be present in dir1."""
        dir1_result = self.root_sub_results[2]
        self.assertTrue(dir1_result.is_ok)

        file1_not_present_result = dir1_result.sub_constraint_results[0]
        self.assertFalse(file1_not_present_result.is_ok)


if __name__ == "__main__":
    unittest.main()
