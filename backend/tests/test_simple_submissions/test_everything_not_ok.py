import tempfile
import typing
import unittest
from pathlib import Path

from domain.simple_submission_checks.constraints.constraint_result import ConstraintResult, ZipConstraintResult
from domain.simple_submission_checks.constraints.directory_constraint import DirectoryConstraint
from domain.simple_submission_checks.constraints.extension_not_present_constraint import ExtensionNotPresentConstraint
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint
from domain.simple_submission_checks.constraints.submission_constraint import SubmissionConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint
from tests.test_simple_submissions import create_directory_and_zip


class FaultyProjectConstraintValidationTest(unittest.TestCase):
    """
    This test case will test the validation of a faulty project directory structure:
    project.zip
    ├── src
    │   ├── main.py
    │   └── utils
    │       ├── helper.py
    │       ├── extra_file.txt
    │       └── malware.exe
    ├── tests
    │   └── test_main.py
    ├── README.md
    ├── .gitignore
    ├── dist
    └── extra.log
    """

    structure: typing.ClassVar = {
        "src": {
            "main.py": None,
            "utils": {
                "helper.py": None,
                "extra_file.txt": None,  # Extra file that should not be present
                "malware.exe": None,  # exe file that should not be present
            },
        },
        "tests": {"test_main.py": None},
        "README.md": None,
        ".gitignore": None,
        "dist": {},  # Extra directory that should not be present
        "extra.log": None,  # Extra log file that should not be present
    }

    submission_constraint = SubmissionConstraint(
        root_constraint=ZipConstraint(
            zip_name="project.zip",
            global_constraints=[ExtensionNotPresentConstraint(extension=".exe")],
            sub_constraints=[
                DirectoryConstraint(
                    directory_name="src",
                    sub_constraints=[
                        FileConstraint(file_name="main.py"),
                        DirectoryConstraint(
                            directory_name="utils",
                            sub_constraints=[
                                FileConstraint(file_name="helper.py"),
                                NotPresentConstraint(file_or_directory_name="extra_file.txt"),
                            ],
                        ),
                    ],
                ),
                DirectoryConstraint(
                    directory_name="tests",
                    sub_constraints=[FileConstraint(file_name="test_main.py")],
                ),
                FileConstraint(file_name="README.md"),
                FileConstraint(file_name=".gitignore"),
                NotPresentConstraint(file_or_directory_name="dist"),
                ExtensionNotPresentConstraint(extension=".log"),
            ],
        ),
    )

    temp_dir = tempfile.TemporaryDirectory()
    temp_dir_path = Path(temp_dir.name)

    @classmethod
    def setUpClass(cls) -> None:
        create_directory_and_zip(cls.structure, cls.temp_dir_path, "project")
        res: ConstraintResult = cls.submission_constraint.validate_constraint(cls.temp_dir_path)
        assert isinstance(res.root_constraint_result, ZipConstraintResult)
        cls.res = res
        cls.root_sub_results = res.root_constraint_result.sub_constraint_results
        cls.global_sub_results = res.root_constraint_result.global_constraint_result

    @classmethod
    def tearDownClass(cls) -> None:
        cls.temp_dir.cleanup()

    def test_submission_ok(self) -> None:
        self.assertFalse(self.res.is_ok)

    def test_src(self) -> None:
        """src should be valid."""
        src_sub_result = self.root_sub_results[0]
        self.assertTrue(src_sub_result.is_ok)  # Extra file in src/utils

    def test_tests(self) -> None:
        """tests should be valid."""
        tests_sub_result = self.root_sub_results[1]
        self.assertTrue(tests_sub_result.is_ok)

    def test_readme(self) -> None:
        """README.md should be valid."""
        readme_result = self.root_sub_results[2]
        self.assertTrue(readme_result.is_ok)

    def test_gitignore(self) -> None:
        """.gitignore should be valid."""
        gitignore_result = self.root_sub_results[3]
        self.assertTrue(gitignore_result.is_ok)

    def test_not_present_dir(self) -> None:
        """dist should not be present."""
        dist_sub_result = self.root_sub_results[4]
        self.assertFalse(dist_sub_result.is_ok)  # dist directory is present

    def test_no_log_files(self) -> None:
        """No .log files should be present."""
        log_sub_result = self.root_sub_results[5]
        self.assertFalse(log_sub_result.is_ok)  # .log file is present

    def test_no_exe_files_globally(self) -> None:
        """No .exe files should be present globally."""
        assert self.global_sub_results is not None
        self.assertFalse(self.global_sub_results.is_ok)
        self.assertEqual(len(self.global_sub_results.global_constraint_results["src/utils"]), 1)


if __name__ == "__main__":
    unittest.main()
