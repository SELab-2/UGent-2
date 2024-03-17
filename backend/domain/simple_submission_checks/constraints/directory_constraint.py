from __future__ import annotations

import os
from typing import Literal, Optional

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint
from domain.simple_submission_checks.validation_result import ErrorResult, OkResult


class DirectoryConstraint(BaseModel):
    type: Literal["directory_constraint"]
    name: str
    sub_constraints: list[DirectoryConstraint | FileConstraint | NotPresentConstraint]

    def validate_constraint(self, path: str):
        dir_path = os.path.join(path, self.name)
        if not os.path.isdir(dir_path):
            return ErrorResult(f"Directory '{self.name}' not present.")

        sub_results = [constraint.validate_constraint(dir_path) for constraint in self.sub_constraints]
        return OkResult(f"Directory '{self.name}' present.", sub_results)


# Needed to enable self-referencing model
DirectoryConstraint.update_forward_refs()
