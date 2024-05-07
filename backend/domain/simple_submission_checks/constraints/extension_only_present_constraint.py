import os
from pathlib import Path

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import (
    ConstraintType,
    ExtensionOnlyPresentConstraintResult,
)


class ExtensionOnlyPresentConstraint(BaseModel):
    type: ConstraintType = ConstraintType.EXTENSION_ONLY_PRESENT
    extension: str

    def validate_constraint(self, path: Path) -> ExtensionOnlyPresentConstraintResult:
        directory = os.listdir(path)

        # Filter out directories.
        files = [file for file in directory if Path.is_file(path / file)]
        files_without_extension = [file for file in files if not file.endswith(self.extension)]

        if files_without_extension:
            return ExtensionOnlyPresentConstraintResult(
                extension=self.extension,
                is_ok=False,
                files_without_extension=files_without_extension,
            )

        return ExtensionOnlyPresentConstraintResult(
            extension=self.extension,
            is_ok=True,
            files_without_extension=files_without_extension,
        )
