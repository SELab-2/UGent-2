import shutil
import tempfile
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.only_present_constraint import OnlyPresentConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class OnlyPresentDirectoryConstraintValidationTest(unittest.TestCase):
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
                OnlyPresentConstraint(
                    name="dir1",
                    sub_constraints=[
                        FileConstraint(name="file1.txt"),
                    ],
                ),
                OnlyPresentConstraint(
                    name="dir2",
                    sub_constraints=[
                        FileConstraint(name="file2.txt"),
                    ],
                ),
                OnlyPresentConstraint(
                    name="dir3",
                    sub_constraints=[
                        FileConstraint(name="file3.txt"),  # This constraint will not be satisfied
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
        file4 = dir3_path / "file4.txt"  # This file will cause the constraint to fail

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

    def test_dir1(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        res1 = res.sub_constraint_results[0]
        self.assertTrue(res1.is_ok)
        self.assertEqual(res1.name, "dir1")
        self.assertEqual(len(res1.sub_constraint_results), 1)

    def test_dir2(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        res2 = res.sub_constraint_results[1]
        self.assertTrue(res2.is_ok)
        self.assertEqual(res2.name, "dir2")
        self.assertEqual(len(res2.sub_constraint_results), 1)

    def test_unsatisfied_constraint(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        res3 = res.sub_constraint_results[2]  # The result for the new constraint
        self.assertFalse(res3.is_ok)  # The constraint should not be satisfied
        self.assertEqual(res3.name, "dir3")
        self.assertEqual(len(res3.sub_constraint_results), 0)


if __name__ == "__main__":
    unittest.main()
