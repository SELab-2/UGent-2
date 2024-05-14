import tempfile
import typing
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.constraint_result import ConstraintResult, ZipConstraintResult
from domain.simple_submission_checks.constraints.extension_not_present_constraint import ExtensionNotPresentConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint
from tests.test_simple_submissions import create_directory_and_zip


class GlobalConstraintValidationTest(unittest.TestCase):
    structure1: typing.ClassVar = {
        "dir3": {
            "file5.cython": None,
            "subdir3": {
                "file6.md": None,
            },
        },
    }

    structure2: typing.ClassVar = {
        "file1.java": None,
        "dir3": {
            "file5.cython": None,
            "subdir3": {
                "file6.c": None,
            },
        },
    }

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            zip_name="submission.zip",
            global_constraints=[
                ExtensionNotPresentConstraint(extension=".java"),
                ExtensionNotPresentConstraint(extension=".c"),
                ExtensionNotPresentConstraint(extension=".cpp"),
                NotPresentConstraint(file_or_directory_name="dir4"),
            ],
            sub_constraints=[],
        ),
    )

    temp_dir1 = tempfile.TemporaryDirectory()
    temp_dir2 = tempfile.TemporaryDirectory()
    temp_dir_path1 = Path(temp_dir1.name)
    temp_dir_path2 = Path(temp_dir2.name)

    @classmethod
    def setUpClass(cls) -> None:
        create_directory_and_zip(cls.structure1, cls.temp_dir_path1, "submission")
        create_directory_and_zip(cls.structure2, cls.temp_dir_path2, "submission")

        res1: ConstraintResult = cls.submission_constraint.validate_constraint(cls.temp_dir_path1)
        res2: ConstraintResult = cls.submission_constraint.validate_constraint(cls.temp_dir_path2)

        assert isinstance(res1.root_constraint_result, ZipConstraintResult)
        assert isinstance(res2.root_constraint_result, ZipConstraintResult)

        cls.global_sub_result1 = res1.root_constraint_result.global_constraint_result
        cls.global_sub_result2 = res2.root_constraint_result.global_constraint_result

    @classmethod
    def tearDownClass(cls) -> None:
        cls.temp_dir1.cleanup()
        cls.temp_dir2.cleanup()

    def test_correct(self) -> None:
        """Test that .java files are correctly identified."""
        assert self.global_sub_result1 is not None
        self.assertTrue(self.global_sub_result1.is_ok)

    def test_incorrect(self) -> None:
        """Test that .java files are correctly identified."""
        assert self.global_sub_result2 is not None
        self.assertFalse(self.global_sub_result2.is_ok)


if __name__ == "__main__":
    unittest.main()
