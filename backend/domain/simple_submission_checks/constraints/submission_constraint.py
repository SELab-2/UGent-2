from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import SubmissionConstraintResult
from domain.simple_submission_checks.constraints.extension_not_present_constraint import ExtensionNotPresentConstraint
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.global_constraint import GlobalConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class SubmissionConstraint(BaseModel):
    type: Literal["submission_constraint"] = "submission_constraint"
    root_constraint: ZipConstraint | FileConstraint  # Submission can be a file or a zip.
    global_constraints: list[NotPresentConstraint | ExtensionNotPresentConstraint]

    def validate_constraint(self, path: Path) -> SubmissionConstraintResult:
        global_constraint_result = GlobalConstraint(constraints=self.global_constraints)

        return SubmissionConstraintResult(
            is_ok=True,  # to-do
            root_constraint_result=self.root_constraint.validate_constraint(path),
            global_constraint_result=global_constraint_result.validate_constraint(path),
        )


def create_constraint_from_json(json: str) -> SubmissionConstraint:
    return SubmissionConstraint.model_validate_json(json)
