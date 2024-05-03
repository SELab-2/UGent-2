import os
from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import (
    ConstraintResult,
    ExtensionNotPresentConstraintResult,
)


class ExtensionNotPresentConstraint(BaseModel):
    type: Literal["extension_not_present_constraint"] = "extension_not_present_constraint"
    extension: str

    def validate_constraint(self, path: Path) -> ConstraintResult:
        directory = os.listdir(path)

        files_with_extension = [file for file in directory if file.endswith(self.extension)]

        if files_with_extension:
            return ExtensionNotPresentConstraintResult(
                extension=self.extension,
                is_ok=False,
                files_with_extension=files_with_extension,
            )

        return ExtensionNotPresentConstraintResult(
            extension=self.extension,
            is_ok=True,
            files_with_extension=files_with_extension,
        )
