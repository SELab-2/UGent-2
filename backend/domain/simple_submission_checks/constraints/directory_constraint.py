from __future__ import annotations

from pathlib import Path

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import (
    ConstraintType,
    DirectoryConstraintResult,
)
from domain.simple_submission_checks.constraints.extension_not_present_constraint import ExtensionNotPresentConstraint
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint


class DirectoryConstraint(BaseModel):
    type: ConstraintType = ConstraintType.DIRECTORY
    directory_name: str
    sub_constraints: list[
        FileConstraint |
        NotPresentConstraint |
        DirectoryConstraint |
        ExtensionNotPresentConstraint
        ]

    def validate_constraint(self, path: Path) -> DirectoryConstraintResult:
        dir_path = path / self.directory_name
        if not Path.is_dir(dir_path):
            return DirectoryConstraintResult(
                directory_name=self.directory_name,
                is_ok=False,
                sub_constraint_results=[],
            )

        sub_results = [constraint.validate_constraint(dir_path) for constraint in self.sub_constraints]
        return DirectoryConstraintResult(
            directory_name=self.directory_name,
            is_ok=True,
            sub_constraint_results=sub_results,
        )
