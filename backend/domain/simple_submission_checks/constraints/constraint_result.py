from __future__ import annotations

from enum import Enum

from pydantic import BaseModel


class ConstraintType(Enum):
    FILE = "FILE"
    NOT_PRESENT = "NOT_PRESENT"
    DIRECTORY = "DIRECTORY"
    ZIP = "ZIP"
    SUBMISSION = "SUBMISSION"


class ConstraintResult(BaseModel):
    type: ConstraintType
    name: str
    is_ok: bool
    sub_constraint_results: list = []

    def __str__(self, level: int = 0):
        status = "\u2714 [OK] " if self.is_ok else "\u2718 [FAIL]"
        ret = f"{'\t' * level}{status} {self.type.name}: {self.name}"
        if self.sub_constraint_results:
            sub_results_str = "\n".join(sub_result.__str__(level + 1) for sub_result in self.sub_constraint_results)
            ret += "\n" + sub_results_str
        return ret


class FileConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.FILE


class NotPresentConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.NOT_PRESENT


class DirectoryConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.DIRECTORY
    sub_constraint_results: list[ConstraintResult]


class ZipConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.ZIP
    sub_constraint_results: list[ConstraintResult]


class SubmissionConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.SUBMISSION
    sub_constraint_results: list[ConstraintResult]
