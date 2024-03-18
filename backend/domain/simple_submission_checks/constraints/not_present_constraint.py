import os
from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import ConstraintResult, NotPresentConstraintResult


class NotPresentConstraint(BaseModel):
    type: Literal["not_present_constraint"]
    name: str

    def validate_constraint(self, path: Path) -> ConstraintResult:
        directory = os.listdir(path)

        if self.name in directory:
            return NotPresentConstraintResult(name=self.name, is_ok=False, sub_constraint_results=[])

        return NotPresentConstraintResult(name=self.name, is_ok=True, sub_constraint_results=[])
