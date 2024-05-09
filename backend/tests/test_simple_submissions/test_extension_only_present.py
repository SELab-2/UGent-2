import tempfile
import typing
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.constraint_result import ConstraintResult, ZipConstraintResult
from domain.simple_submission_checks.constraints.extension_only_present_constraint import ExtensionOnlyPresentConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint
from tests.test_simple_submissions import create_directory_and_zip


class ExtensionOnlyPresentConstraintNestedDirTest(unittest.TestCase):
    """
    This test case will test the validation of a directory structure:
    submission.zip
    ├── dir1
    │   ├── file1.py
    │   ├── file2.py
    │   ├── file3.py
    │   ├── subdir1
    │   │   ├── file4.py
    │   │   └── file5.py
    │   └── subdir2
    │       ├── file6.py
    │       └── file7.py
    ├── dir2
    │   ├── file8.py
    │   └── file9.py
    ├── file10.py
    """

    structure: typing.ClassVar = {
        "dir1": {
            "file1.py": None,
            "file2.py": None,
            "file3.py": None,
            "subdir1": {
                "file4.py": None,
                "file5.py": None,
            },
            "subdir2": {
                "file6.py": None,
                "file7.py": None,
            },
        },
        "dir2": {
            "file8.py": None,
            "file9.py": None,
        },
        "file10.py": None,
        "file11.py": None,
        "file12.py": None,
    }

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            zip_name="submission.zip",
            global_constraints=[ExtensionOnlyPresentConstraint(extension=".py")],
            sub_constraints=[
                ExtensionOnlyPresentConstraint(extension=".py"),  # .py is not the only extension, should fail
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
        cls.res = res
        cls.global_sub_result = res.root_constraint_result.global_constraint_result
        cls.root_sub_results = res.root_constraint_result.sub_constraint_results

    @classmethod
    def tearDownClass(cls) -> None:
        cls.temp_dir.cleanup()

    def test_py_extension(self) -> None:
        """There are only py files in the root of the submission zip"""
        self.assertTrue(self.root_sub_results[0].is_ok)

    def test_global_constraint(self) -> None:
        """There are only python files in the submission zip"""
        assert self.global_sub_result is not None
        self.assertTrue(self.global_sub_result.is_ok)

    def test_submission_ok(self) -> None:
        """All constraints are satisfied."""
        self.assertTrue(self.res.is_ok)


if __name__ == "__main__":
    unittest.main()
