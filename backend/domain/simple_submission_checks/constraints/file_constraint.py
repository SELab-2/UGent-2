import os
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.validation_result import ValidationResult, ErrorResult, OkResult


class FileConstraint(BaseModel):
    type: Literal["file_constraint"]
    name: str

    def validate_constraint(self, path: str) -> ValidationResult:
        directory = os.listdir(path)

        if self.name not in directory:
            return ErrorResult(f"File '{self.name}' not present.")

        return OkResult(f"File '{self.name}' present.", [])
