from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING, Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import (
    ConstraintResult,
    DirectoryConstraintResult,
)
from domain.simple_submission_checks.constraints.extension_not_present_constraint import ExtensionNotPresentConstraint
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint

if TYPE_CHECKING:
    from domain.simple_submission_checks.constraints.only_present_constraint import OnlyPresentConstraint


class DirectoryConstraint(BaseModel):
    type: Literal["directory_constraint"] = "directory_constraint"
    name: str
    sub_constraints: list[
        FileConstraint |
        NotPresentConstraint |
        OnlyPresentConstraint |
        DirectoryConstraint |
        ExtensionNotPresentConstraint
        ]

    def validate_constraint(self, path: Path) -> ConstraintResult:
        dir_path = path / self.name
        if not Path.is_dir(dir_path):
            return DirectoryConstraintResult(name=self.name, is_ok=False, sub_constraint_results=[])

        sub_results: list[ConstraintResult]
        sub_results = [constraint.validate_constraint(dir_path) for constraint in self.sub_constraints]
        return DirectoryConstraintResult(name=self.name, is_ok=True, sub_constraint_results=sub_results)
