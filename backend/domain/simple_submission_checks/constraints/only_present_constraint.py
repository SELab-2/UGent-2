from __future__ import annotations

import os
from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import (
    ConstraintResult,
    DirectoryConstraintResult,
    OnlyPresentDirectoryConstraintResult,
)
from domain.simple_submission_checks.constraints.directory_constraint import DirectoryConstraint
from domain.simple_submission_checks.constraints.file_constraint import FileConstraint


class OnlyPresentConstraint(BaseModel):
    type: Literal["only_present_directory_constraint"] = "only_present_directory_constraint"
    name: str
    # NotPresentConstraint is not possible
    sub_constraints: list[OnlyPresentConstraint | DirectoryConstraint | FileConstraint]

    def validate_constraint(self, path: Path) -> ConstraintResult:
        dir_path = path / self.name
        if not Path.is_dir(dir_path):
            return DirectoryConstraintResult(
                name=self.name,
                is_ok=False,
                sub_constraint_results=[],
            )

        # Only the files specified should be present
        names_sub_constraints = {sub_constraint.name for sub_constraint in self.sub_constraints}  # Specified files.
        names_of_folder = set(os.listdir(dir_path))  # present files.

        if names_sub_constraints != names_of_folder:  # Contents should match exactly.
            return OnlyPresentDirectoryConstraintResult(
                name=self.name,
                is_ok=False,
                should_be_in_but_are_not=list(names_sub_constraints - names_of_folder),
                should_not_be_in_but_are=list(names_of_folder - names_sub_constraints),
                sub_constraint_results=[],
            )

        sub_results: list[ConstraintResult]
        sub_results = [constraint.validate_constraint(dir_path) for constraint in self.sub_constraints]

        return OnlyPresentDirectoryConstraintResult(
            name=self.name,
            is_ok=True,
            should_be_in_but_are_not=[],
            should_not_be_in_but_are=[],
            sub_constraint_results=sub_results,
        )


# Needed to enable self-referencing model
OnlyPresentConstraint.model_rebuild()
