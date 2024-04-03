import shutil
import tempfile
import unittest
from pathlib import Path

# Assuming your model imports are correct...
from domain.simple_submission_checks.constraints.directory_constraint import DirectoryConstraint
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class ConstraintValidationTest(unittest.TestCase):
    """
    This test case will test the validation of a simple directory structure:
    submission.zip
    ├── file1.txt
    └── file2.txt
    """

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            name="submission.zip",
            sub_constraints=[
                DirectoryConstraint(
                    name="my_submission_folder",
                    sub_constraints=[
                        FileConstraint(name="file1.txt"),
                        FileConstraint(name="file2.txt"),
                    ],
                ),
            ],
        ),
    )

    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_dir_path = Path(self.temp_dir.name)

        # structure of directory
        submission_path = self.temp_dir_path / "my_submission_folder"
        file1 = submission_path / "file1.txt"
        file2 = submission_path / "file2.txt"

        submission_path.mkdir()
        file1.touch()
        file2.touch()

        # create a zip file
        zip_path = self.temp_dir_path / "submission"
        shutil.make_archive(str(zip_path), "zip", self.temp_dir_path)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_submission(self) -> None:
        root_constraint = self.submission_constraint.root_constraint
        self.assertIsInstance(root_constraint, ZipConstraint)
        self.assertEqual(root_constraint.name, "submission.zip")
        self.assertEqual(len(root_constraint.sub_constraints), 1)
        self.assertIsInstance(root_constraint.sub_constraints[0], DirectoryConstraint)

    def test_directory(self) -> None:
        res = self.submission_constraint.validate_constraint(self.temp_dir_path)
        self.assertEqual(len(res.sub_constraint_results), 1)
        res = res.sub_constraint_results[0]
        self.assertTrue(res.is_ok)
        self.assertEqual(res.name, "my_submission_folder")
        self.assertEqual(len(res.sub_constraint_results), 2)

    def test_files(self) -> None:
        directory_constraint = self.submission_constraint.root_constraint.sub_constraints[0]
        self.assertEqual(len(directory_constraint.sub_constraints), 2)
        self.assertIsInstance(directory_constraint.sub_constraints[0], FileConstraint)
        self.assertEqual(directory_constraint.sub_constraints[0].name, "file1.txt")
        self.assertIsInstance(directory_constraint.sub_constraints[1], FileConstraint)
        self.assertEqual(directory_constraint.sub_constraints[1].name, "file2.txt")


if __name__ == "__main__":
    unittest.main()
