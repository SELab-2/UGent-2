import shutil
import tempfile
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.only_present_constraint import OnlyPresentConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class EdgeCaseConstraintValidationTest(unittest.TestCase):
    """
    This test case will test the validation of a deeply nested directory structure with edge cases:
    submission.zip
    ├── dir1 (edge case: empty directory)
    ├── dir2
    │   └── file2.txt (edge case: unexpected file)
    └── dir3
        └── file3.txt (edge case: missing file)
    """

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            name="submission.zip",
            sub_constraints=[
                OnlyPresentConstraint(
                    name="dir1",
                    sub_constraints=[],
                ),
                OnlyPresentConstraint(
                    name="dir2",
                    sub_constraints=[
                        FileConstraint(name="file1.txt"),  # Expecting file1.txt but file2.txt is present
                    ],
                ),
                OnlyPresentConstraint(
                    name="dir3",
                    sub_constraints=[
                        FileConstraint(name="file3.txt"),
                        FileConstraint(name="file4.txt"),  # file4.txt is expected but missing
                    ],
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
        dir3_path = self.temp_dir_path / "dir3"
        file2 = dir2_path / "file2.txt"
        file3 = dir3_path / "file3.txt"

        dir1_path.mkdir()
        dir2_path.mkdir()
        dir3_path.mkdir()
        file2.touch()
        file3.touch()

        # create a zip file
        zip_path = self.temp_dir_path / "submission"
        shutil.make_archive(str(zip_path), "zip", self.temp_dir_path)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_empty_directory(self) -> None:
        only_present_constraint = OnlyPresentConstraint(name="dir1", sub_constraints=[])
        res = only_present_constraint.validate_constraint(self.temp_dir_path)
        self.assertTrue(res.is_ok)  # The constraint should be satisfied because dir1 is empty

    def test_unexpected_file(self) -> None:
        file_constraint = FileConstraint(name="file1.txt")
        res = file_constraint.validate_constraint(self.temp_dir_path / "dir2")
        self.assertFalse(res.is_ok)  # The constraint should not be satisfied because file1.txt is not present

    def test_missing_file(self) -> None:
        file_constraint = FileConstraint(name="file4.txt")
        res = file_constraint.validate_constraint(self.temp_dir_path / "dir3")
        self.assertFalse(res.is_ok)  # The constraint should not be satisfied because file4.txt is missing


if __name__ == "__main__":
    unittest.main()
