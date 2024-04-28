import shutil
import tempfile
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.extension_not_present_constraint import ExtensionNotPresentConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class ExtensionNotPresentConstraintValidationTest(unittest.TestCase):
    """
    This test case will test the validation of a directory structure:
    submission.zip
    ├── file1.txt
    ├── file2.py
    ├── file3.md
    ├── file4.java
    └── file5.c
    """

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            name="submission.zip",
            sub_constraints=[
                ExtensionNotPresentConstraint(name=".java"),  # This extension is present in the zip file
                ExtensionNotPresentConstraint(name=".txt"),  # This extension is present in the zip file
                ExtensionNotPresentConstraint(name=".c"),    # This extension is present in the zip file
                ExtensionNotPresentConstraint(name=".cpp"),  # This extension is not present in the zip file
            ],
        ),
    )

    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_dir_path = Path(self.temp_dir.name)

        # structure of directory
        (self.temp_dir_path / "file1.txt").touch()
        (self.temp_dir_path / "file2.py").touch()
        (self.temp_dir_path / "file3.md").touch()
        (self.temp_dir_path / "file4.java").touch()
        (self.temp_dir_path / "file5.c").touch()
        (self.temp_dir_path / "file6.c").touch()

        # create a zip file
        zip_path = self.temp_dir_path / "submission"
        shutil.make_archive(str(zip_path), "zip", self.temp_dir_path)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_java_extension_constraint(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        res1 = res.sub_constraint_results[0]
        self.assertFalse(res1.is_ok)  # The constraint should not be satisfied because .java is present
        self.assertEqual(res1.files_with_extension, ["file4.java"])

    def test_txt_extension_constraint(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        res2 = res.sub_constraint_results[1]
        self.assertFalse(res2.is_ok)  # The constraint should not be satisfied because .txt is present
        self.assertEqual(res2.files_with_extension, ["file1.txt"])

    def test_c_extension_constraint(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        res3 = res.sub_constraint_results[2]
        self.assertFalse(res3.is_ok)  # The constraint should not be satisfied because .c is present
        self.assertEqual(res3.files_with_extension, ["file5.c", "file6.c"])

    def test_cpp_extension_constraint(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        res4 = res.sub_constraint_results[3]
        self.assertTrue(res4.is_ok)  # The constraint should be satisfied because .cpp is not present


if __name__ == "__main__":
    unittest.main()
