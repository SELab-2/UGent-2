from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import (
    ConstraintResult,
    DirectoryConstraintResult,
)
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint


class DirectoryConstraint(BaseModel):
    type: Literal["directory_constraint"]
    name: str
    sub_constraints: list[DirectoryConstraint | FileConstraint | NotPresentConstraint]

    def validate_constraint(self, path: Path) -> ConstraintResult:
        dir_path = path/self.name
        if not Path.is_dir(dir_path):
            return DirectoryConstraintResult(name=self.name, is_ok=False, sub_constraint_results=[])

        sub_results: list[ConstraintResult]
        sub_results = [constraint.validate_constraint(dir_path) for constraint in self.sub_constraints]
        return DirectoryConstraintResult(name=self.name, is_ok=True, sub_constraint_results=sub_results)


# Needed to enable self-referencing model
DirectoryConstraint.model_rebuild()
