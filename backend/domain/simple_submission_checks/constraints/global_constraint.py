# Voor de global constraint kan enkel de extension not present en de not present constraint gebruikt worden.

from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import GlobalConstraintResult
from domain.simple_submission_checks.constraints.extension_not_present_constraint import ExtensionNotPresentConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint


class GlobalConstraint(BaseModel):
    type: Literal["global_constraint"] = "global_constraint"
    sub_constraints: list[ExtensionNotPresentConstraint | NotPresentConstraint]

    def validate_constraint(self, path: Path) -> GlobalConstraintResult:
        sub_results = []
        sub_folders = [subfile for subfile in path.rglob("*") if subfile.is_dir()]
        for folder in sub_folders:
            for constraint in self.sub_constraints:
                constraint_result = constraint.validate_constraint(folder)
                sub_results.append(constraint_result)

        return GlobalConstraintResult(
            is_ok=all(result.is_ok for result in sub_results),
            sub_constraint_results=sub_results,
        )
