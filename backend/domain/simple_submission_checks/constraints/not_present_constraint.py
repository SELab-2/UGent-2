import os
from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import ConstraintResult, NotPresentConstraintResult


class NotPresentConstraint(BaseModel):
    type: Literal["not_present_constraint"] = "not_present_constraint"
    sub_constraints: list = []
    file_or_directory_name: str

    def validate_constraint(self, path: Path) -> ConstraintResult:
        directory = os.listdir(path)

        if self.file_or_directory_name in directory:
            return NotPresentConstraintResult(file_or_directory_name=self.file_or_directory_name, is_ok=False)

        return NotPresentConstraintResult(file_or_directory_name=self.file_or_directory_name, is_ok=True)
