import os
import tempfile
import zipfile
from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import ZipConstraintResult
from domain.simple_submission_checks.constraints.directory_constraint import DirectoryConstraint
from domain.simple_submission_checks.constraints.extension_not_present_constraint import ExtensionNotPresentConstraint
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint


class ZipConstraint(BaseModel):
    type: Literal["zip_constraint"] = "zip_constraint"
    zip_name: str
    sub_constraints: list[
        DirectoryConstraint |
        FileConstraint |
        NotPresentConstraint |
        ExtensionNotPresentConstraint
        ]

    def validate_constraint(self, path: Path) -> ZipConstraintResult:
        directory = os.listdir(path)

        # Check if file is present.
        if self.zip_name not in directory:
            return ZipConstraintResult(
                zip_name=self.zip_name,
                is_ok=False,
                sub_constraint_results=[],
            )

        # Check if file is a zip file.
        zip_path = path / self.zip_name
        if not zipfile.is_zipfile(zip_path):
            return ZipConstraintResult(
                zip_name=self.zip_name,
                is_ok=False,
                sub_constraint_results=[],
            )

        # Extract file into a Temp directory and validate sub constraints.
        with tempfile.TemporaryDirectory() as tmp_dir, zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(tmp_dir)
            sub_constraints = [constraint.validate_constraint(Path(tmp_dir)) for constraint in self.sub_constraints]
            return ZipConstraintResult(zip_name=self.zip_name, is_ok=True, sub_constraint_results=sub_constraints)
