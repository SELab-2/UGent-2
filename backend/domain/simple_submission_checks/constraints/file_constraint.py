from pathlib import Path

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import ConstraintType, FileConstraintResult


class FileConstraint(BaseModel):
    type: ConstraintType = ConstraintType.FILE
    file_name: str

    def validate_constraint(self, path: Path) -> FileConstraintResult:
        file_path = path / self.file_name

        if not file_path.exists() or file_path.is_dir():
            return FileConstraintResult(
                file_name=self.file_name,
                is_ok=False,
            )

        return FileConstraintResult(
            file_name=self.file_name,
            is_ok=True,
        )
