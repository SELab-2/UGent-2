import os
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.validation_result import ErrorResult, OkResult


class NotPresentConstraint(BaseModel):
    type: Literal["not_present_constraint"]
    name: str

    def validate_constraint(self, path: str):
        directory = os.listdir(path)

        if self.name in directory:
            return ErrorResult(f"'{self.name}' must not be present.")

        return OkResult(f"'{self.name}' not present.", [])
