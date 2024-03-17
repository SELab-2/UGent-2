from pathlib import Path

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint
from domain.simple_submission_checks.validation_result import ValidationResult


class SubmissionConstraint(BaseModel):
    root_constraint: ZipConstraint | FileConstraint

    def validate_constraint(self, path: Path) -> ValidationResult:
        return self.root_constraint.validate_constraint(path)
