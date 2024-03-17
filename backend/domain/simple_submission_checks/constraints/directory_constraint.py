from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint
from domain.simple_submission_checks.validation_result import ErrorResult, OkResult, ValidationResult


class DirectoryConstraint(BaseModel):
    type: Literal["directory_constraint"]
    name: str
    sub_constraints: list[DirectoryConstraint | FileConstraint | NotPresentConstraint]

    def validate_constraint(self, path: Path) -> ValidationResult:
        dir_path = path / self.name
        if not Path.is_dir(dir_path):
            return ErrorResult(f"Directory '{self.name}' not present.")

        sub_results = [constraint.validate_constraint(dir_path) for constraint in self.sub_constraints]
        return OkResult(f"Directory '{self.name}' present.", sub_results)


# Needed to enable self-referencing model
DirectoryConstraint.update_forward_refs()
