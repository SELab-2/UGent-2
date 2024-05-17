from pathlib import Path

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import (
    ConstraintType,
    SubmissionConstraintResult,
)
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class SubmissionConstraint(BaseModel):
    type: ConstraintType = ConstraintType.SUBMISSION
    root_constraint: ZipConstraint | FileConstraint  # Submission can be a file or a zip.

    def validate_constraint(self, path: Path) -> SubmissionConstraintResult:
        root_constraint_result = self.root_constraint.validate_constraint(path)

        return SubmissionConstraintResult(
            is_ok=root_constraint_result.recursive_is_ok(),
            root_constraint_result=root_constraint_result,
        )


def create_constraint_from_json(json: str) -> SubmissionConstraint:
    return SubmissionConstraint.model_validate_json(json)
