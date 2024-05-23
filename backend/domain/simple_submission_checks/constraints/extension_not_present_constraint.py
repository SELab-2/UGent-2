import os
from pathlib import Path

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import (
    ConstraintType,
    ExtensionNotPresentConstraintResult,
)


class ExtensionNotPresentConstraint(BaseModel):
    type: ConstraintType = ConstraintType.EXTENSION_NOT_PRESENT
    not_present_extension: str

    def validate_constraint(self, path: Path) -> ExtensionNotPresentConstraintResult:
        directory = os.listdir(path)

        files_with_extension = [file for file in directory if file.endswith(self.not_present_extension)]

        if files_with_extension:
            return ExtensionNotPresentConstraintResult(
                extension=self.not_present_extension,
                is_ok=False,
                files_with_extension=files_with_extension,
            )

        return ExtensionNotPresentConstraintResult(
            extension=self.not_present_extension,
            is_ok=True,
            files_with_extension=files_with_extension,
        )
