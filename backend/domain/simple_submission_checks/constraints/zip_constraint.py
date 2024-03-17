import os
import tempfile
import zipfile
from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.directory_constraint import DirectoryConstraint
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint
from domain.simple_submission_checks.validation_result import ErrorResult, OkResult, ValidationResult


class ZipConstraint(BaseModel):
    type: Literal["zip_constraint"]
    name: str
    sub_constraints: list[DirectoryConstraint | FileConstraint | NotPresentConstraint]

    def validate_constraint(self, path: Path) -> ValidationResult:
        directory = os.listdir(path)

        # Check if file is present.
        if self.name not in directory:
            return ErrorResult(f"Zip file '{self.name}' not present.")

        # Check if file is a zip file.
        zip_path = path / self.name
        if not zipfile.is_zipfile(zip_path):
            return ErrorResult(f"File '{self.name}' is not a zip file.")

        # Extract file into a Temp directory and validate sub constraints.
        with tempfile.TemporaryDirectory() as tmp_dir, zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(tmp_dir)
            sub_constraints = [constraint.validate_constraint(Path(tmp_dir)) for constraint in self.sub_constraints]
            return OkResult(f"Zip file '{self.name}' present.", sub_constraints)
