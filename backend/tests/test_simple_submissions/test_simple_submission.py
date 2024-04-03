import os
import tempfile
import unittest
import zipfile
from pathlib import Path

# Assuming your model imports are correct...
from domain.simple_submission_checks.constraints.directory_constraint import DirectoryConstraint
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class ConstraintValidationTest(unittest.TestCase):

    def create_zip_with_directory_constraint(self, base_dir: Path,
                                             directory_constraint: DirectoryConstraint) -> ZipConstraint:
        """
        Create a zip file based on a directory constraint, simulating the structure defined by the constraint.
        """
        dir_path = base_dir / directory_constraint.name
        dir_path.mkdir()
        for sub_constraint in directory_constraint.sub_constraints:
            if isinstance(sub_constraint, FileConstraint):
                (dir_path / sub_constraint.name).touch()
            elif isinstance(sub_constraint, DirectoryConstraint):
                self.create_zip_with_directory_constraint(dir_path, sub_constraint)

        zip_path = base_dir / f"{directory_constraint.name}.zip"
        with zipfile.ZipFile(zip_path, "w") as zipf:
            for root, _, files in os.walk(dir_path):
                for file in files:
                    file_path = Path(root) / file
                    zipf.write(file_path, file_path.relative_to(dir_path.parent))

        return ZipConstraint(
            type="zip_constraint",
            name=f"{directory_constraint.name}.zip",
            sub_constraints=[directory_constraint],
        )

    def test_simple_directory_structure(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir_name:
            tmp_dir = Path(tmp_dir_name)

            directory_constraint = DirectoryConstraint(
                type="directory_constraint",
                name="project",
                sub_constraints=[FileConstraint(type="file_constraint", name="README.md")],
            )

            zip_constraint = self.create_zip_with_directory_constraint(tmp_dir, directory_constraint)

            submission_constraint = SubmissionConstraint(
                type="submission_constraint",
                root_constraint=zip_constraint,
            )

            result = submission_constraint.validate_constraint(tmp_dir)
            self.assertTrue(result.is_ok,
                            "Constraint validation failed for a simple directory structure wrapped in a zip.")

    def test_nested_directory_structure(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir_name:
            tmp_dir = Path(tmp_dir_name)

            nested_directory_constraint = DirectoryConstraint(
                type="directory_constraint",
                name="project",
                sub_constraints=[
                    DirectoryConstraint(
                        type="directory_constraint",
                        name="src",
                        sub_constraints=[FileConstraint(type="file_constraint", name="main.py")],
                    ),
                    FileConstraint(type="file_constraint", name="README.md"),
                ],
            )

            zip_constraint = self.create_zip_with_directory_constraint(tmp_dir, nested_directory_constraint)

            submission_constraint = SubmissionConstraint(
                type="submission_constraint",
                root_constraint=zip_constraint,
            )

            result = submission_constraint.validate_constraint(tmp_dir)
            self.assertTrue(result.is_ok, "Constraint validation failed for a nested directory structure.")

    def test_file_absence(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir_name:
            tmp_dir = Path(tmp_dir_name)

            directory_constraint = DirectoryConstraint(
                type="directory_constraint",
                name="project",
                sub_constraints=[
                    NotPresentConstraint(type="not_present_constraint", name="unwanted.txt"),
                ],
            )

            zip_constraint = self.create_zip_with_directory_constraint(tmp_dir, directory_constraint)

            submission_constraint = SubmissionConstraint(
                type="submission_constraint",
                root_constraint=zip_constraint,
            )

            result = submission_constraint.validate_constraint(tmp_dir)
            self.assertTrue(result.is_ok, "Constraint validation failed for file absence.")

    def test_multiple_files_and_directories(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir_name:
            tmp_dir = Path(tmp_dir_name)

            complex_directory_constraint = DirectoryConstraint(
                type="directory_constraint",
                name="project",
                sub_constraints=[
                    FileConstraint(type="file_constraint", name="README.md"),
                    DirectoryConstraint(
                        type="directory_constraint",
                        name="src",
                        sub_constraints=[FileConstraint(type="file_constraint", name="main.py")],
                    ),
                    DirectoryConstraint(
                        type="directory_constraint",
                        name="docs",
                        sub_constraints=[FileConstraint(type="file_constraint", name="guide.md")],
                    ),
                ],
            )

            zip_constraint = self.create_zip_with_directory_constraint(tmp_dir, complex_directory_constraint)

            submission_constraint = SubmissionConstraint(
                type="submission_constraint",
                root_constraint=zip_constraint,
            )

            result = submission_constraint.validate_constraint(tmp_dir)
            self.assertTrue(result.is_ok, "Constraint validation failed for multiple files and directories.")


if __name__ == "__main__":
    unittest.main()
