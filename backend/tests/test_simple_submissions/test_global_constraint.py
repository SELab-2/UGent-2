import shutil
import tempfile
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.extension_not_present_constraint import ExtensionNotPresentConstraint
from domain.simple_submission_checks.constraints.global_constraint import GlobalConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class GlobalConstraintValidationTest(unittest.TestCase):
    """
    This test case will test the validation of a directory structure:
    submission.zip
    ├── dir1
    │   └── file1.txt
    ├── dir2
    │   └── file2.txt
    └── dir3
        ├── file3.txt
        └── file4.txt
    """

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            name="submission.zip",
            sub_constraints=[
                GlobalConstraint(
                    sub_constraints=[
                        ExtensionNotPresentConstraint(name=".java"),
                        NotPresentConstraint(name="unwanted.txt"),
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
        file1 = dir1_path / "file1.txt"
        file2 = dir2_path / "file2.txt"
        file3 = dir3_path / "file3.txt"
        file4 = dir3_path / "file4.txt"

        dir1_path.mkdir()
        dir2_path.mkdir()
        dir3_path.mkdir()
        file1.touch()
        file2.touch()
        file3.touch()
        file4.touch()

        # create a zip file
        zip_path = self.temp_dir_path / "submission"
        shutil.make_archive(str(zip_path), "zip", self.temp_dir_path)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_global_constraint(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        self.assertTrue(res.is_ok)  # The constraint should be satisfied because all constraints are met


if __name__ == "__main__":
    unittest.main()