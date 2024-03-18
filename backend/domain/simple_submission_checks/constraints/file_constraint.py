import os
from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import FileConstraintResult


class FileConstraint(BaseModel):
    type: Literal["file_constraint"]
    name: str

    def validate_constraint(self, path: Path) -> FileConstraintResult:
        directory = os.listdir(path)

        if self.name not in directory:
            return FileConstraintResult(name=self.name, is_ok=False, sub_constraint_results=[])

        return FileConstraintResult(name=self.name, is_ok=True, sub_constraint_results=[])
