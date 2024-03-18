from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import ConstraintResult
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class SubmissionConstraint(BaseModel):
    type: Literal["submission_constraint"]
    root_constraint: ZipConstraint | FileConstraint  # Submission can be a file or a zip.

    def validate_constraint(self, path: Path) -> ConstraintResult:
        return self.root_constraint.validate_constraint(path)
