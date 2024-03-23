import shutil
import tempfile
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.directory_constraint import DirectoryConstraint
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint
from domain.simple_submission_checks.constraints.only_present_constraint import OnlyPresentConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class MixedConstraintValidationTest(unittest.TestCase):
    """
    This test case will test the validation of a deeply nested directory structure:
    submission.zip
    ├── dir1
    │   ├── file1.txt
    │   └── dir2
    │       └── file2.txt
    ├── dir3
    │   └── file3.txt
    └── dir4
        └── file4.txt
    """

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            name="submission.zip",
            sub_constraints=[
                DirectoryConstraint(
                    name="dir1",
                    sub_constraints=[
                        FileConstraint(name="file1.txt"),
                        DirectoryConstraint(
                            name="dir2",
                            sub_constraints=[
                                FileConstraint(name="file2.txt"),
                                NotPresentConstraint(name="file3.txt"),
                            ],
                        ),
                        NotPresentConstraint(name="dir3"),
                    ],
                ),
                OnlyPresentConstraint(
                    name="dir3",
                    sub_constraints=[
                        FileConstraint(name="file3.txt"),
                    ],
                ),
                NotPresentConstraint(name="dir5"),
            ],
        ),
    )

    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_dir_path = Path(self.temp_dir.name)

        # structure of directory
        dir1_path = self.temp_dir_path / "dir1"
        dir2_path = dir1_path / "dir2"
        dir3_path = self.temp_dir_path / "dir3"
        file1 = dir1_path / "file1.txt"
        file2 = dir2_path / "file2.txt"
        file3 = dir3_path / "file3.txt"

        dir1_path.mkdir()
        dir2_path.mkdir()
        dir3_path.mkdir()
        file1.touch()
        file2.touch()
        file3.touch()

        # create a zip file
        zip_path = self.temp_dir_path / "submission"
        shutil.make_archive(str(zip_path), "zip", self.temp_dir_path)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_mixed_constraints(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        self.assertTrue(res.is_ok)  # The constraint should be satisfied because all constraints are met

    def test_file_constraint(self) -> None:
        file_constraint = FileConstraint(name="file1.txt")
        res = file_constraint.validate_constraint(self.temp_dir_path / "dir1")
        self.assertTrue(res.is_ok)  # The constraint should be satisfied because file1.txt is present

    def test_not_present_constraint(self) -> None:
        not_present_constraint = NotPresentConstraint(name="dir5")
        res = not_present_constraint.validate_constraint(self.temp_dir_path)
        self.assertTrue(res.is_ok)  # The constraint should be satisfied because dir5 is not present

    def test_directory_constraint(self) -> None:
        directory_constraint = DirectoryConstraint(name="dir1", sub_constraints=[])
        res = directory_constraint.validate_constraint(self.temp_dir_path)
        self.assertTrue(res.is_ok)  # The constraint should be satisfied because dir1 is present

    def test_only_present_constraint(self) -> None:
        only_present_constraint = OnlyPresentConstraint(name="dir3", sub_constraints=[FileConstraint(name="file3.txt")])
        res = only_present_constraint.validate_constraint(self.temp_dir_path)
        self.assertTrue(res.is_ok)  # The constraint should be satisfied because only file3.txt is present in dir3


if __name__ == "__main__":
    unittest.main()
