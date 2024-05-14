import tempfile
import typing
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints import DirectoryConstraint
from domain.simple_submission_checks.constraints.constraint_result import (
    ConstraintResult,
    DirectoryConstraintResult,
    ZipConstraintResult,
)
from domain.simple_submission_checks.constraints.extension_not_present_constraint import ExtensionNotPresentConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint
from tests.test_simple_submissions import create_directory_and_zip


class ExtensionNotPresentConstraintValidationTest(unittest.TestCase):
    """
    This test case will test the validation of a directory structure:
    submission.zip
    ├── file1.txt
    ├── file2.py
    ├── file3.md
    ├── file4.java
    ├── file5.c
    ├── no_txt_in_this_folder
        └── file6.txt
    """

    structure: typing.ClassVar = {
        "file1.txt": None,
        "file2.py": None,
        "file3.md": None,
        "file4.java": None,
        "file5.c": None,
        "no_txt_in_this_folder": {
            "file6.txt": None,
        },
    }

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            zip_name="submission.zip",
            global_constraints=[],
            sub_constraints=[
                ExtensionNotPresentConstraint(extension=".java"),  # .java is present, should fail
                ExtensionNotPresentConstraint(extension=".c"),     # .c is present, should fail
                ExtensionNotPresentConstraint(extension=".cpp"),   # .cpp is not present, should pass
                DirectoryConstraint(  # Directory is present, should pass
                    directory_name="no_txt_in_this_folder",
                    sub_constraints=[ExtensionNotPresentConstraint(extension=".txt")],  # .txt is present, should fail
                ),
            ],
        ),
    )

    temp_dir = tempfile.TemporaryDirectory()
    temp_dir_path = Path(temp_dir.name)

    @classmethod
    def setUpClass(cls) -> None:
        create_directory_and_zip(cls.structure, cls.temp_dir_path, "submission")
        res: ConstraintResult = cls.submission_constraint.validate_constraint(cls.temp_dir_path)
        assert isinstance(res.root_constraint_result, ZipConstraintResult)
        cls.root_sub_results = res.root_constraint_result.sub_constraint_results

    @classmethod
    def tearDownClass(cls) -> None:
        cls.temp_dir.cleanup()

    def test_java_extension(self) -> None:
        self.assertFalse(self.root_sub_results[0].is_ok)

    def test_c_extension(self) -> None:
        self.assertFalse(self.root_sub_results[1].is_ok)

    def test_cpp_extension(self) -> None:
        self.assertTrue(self.root_sub_results[2].is_ok)

    def test_dir(self) -> None:
        dir_result = self.root_sub_results[3]
        assert isinstance(dir_result, DirectoryConstraintResult)
        self.assertTrue(dir_result.is_ok)
        self.assertFalse(dir_result.sub_constraint_results[0].is_ok)


if __name__ == "__main__":
    unittest.main()
