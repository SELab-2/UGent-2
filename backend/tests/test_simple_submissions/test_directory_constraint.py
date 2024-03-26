import shutil
import tempfile
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.directory_constraint import DirectoryConstraint
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class NestedDirectoryConstraintValidationTest(unittest.TestCase):
    """
    This test case will test the validation of a nested directory structure:
    submission.zip
    ├── dir1
    │   └── file1.txt
    └── dir2
        └── file2.txt
    """

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            name="submission.zip",
            sub_constraints=[
                DirectoryConstraint(
                    name="dir1",
                    sub_constraints=[
                        FileConstraint(name="file1.txt"),
                    ],
                ),
                DirectoryConstraint(
                    name="dir2",
                    sub_constraints=[
                        FileConstraint(name="file2.txt"),
                    ],
                ),
                DirectoryConstraint(
                    name="dir3",  # This directory is not present in the zip file
                    sub_constraints=[],
                ),
            ],
        ),
    )

    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_dir_path = Path(self.temp_dir.name)

        # structure of directory
        dir1_path = self.temp_dir_path / "dir1"
        dir2_path = self.temp_dir_path / "dir2"
        file1 = dir1_path / "file1.txt"
        file2 = dir2_path / "file2.txt"

        dir1_path.mkdir()
        dir2_path.mkdir()
        file1.touch()
        file2.touch()

        # create a zip file
        zip_path = self.temp_dir_path / "submission"
        shutil.make_archive(str(zip_path), "zip", self.temp_dir_path)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_dir1(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        res1 = res.sub_constraint_results[0]
        self.assertTrue(res1.is_ok)  # Only test the validation

    def test_dir2(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        res2 = res.sub_constraint_results[1]
        self.assertTrue(res2.is_ok)  # Only test the validation

    def test_non_existent_directory(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        res3 = res.sub_constraint_results[2]  # The result for the new constraint
        self.assertFalse(res3.is_ok)  # The constraint should not be satisfied


if __name__ == "__main__":
    unittest.main()
