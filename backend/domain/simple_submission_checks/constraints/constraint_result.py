from __future__ import annotations

from enum import Enum

from pydantic import BaseModel


class ConstraintType(Enum):
    FILE = "FILE"
    NOT_PRESENT = "NOT_PRESENT"
    DIRECTORY = "DIRECTORY"
    ONLY_PRESENT = "ONLY_PRESENT"
    ZIP = "ZIP"
    SUBMISSION = "SUBMISSION"
    EXTENSION_NOT_PRESENT = "EXTENSION_NOT_PRESENT"
    GLOBAL = "GLOBAL"


class ConstraintResult(BaseModel):
    type: ConstraintType
    is_ok: bool
    sub_constraint_results: list[ConstraintResult] = []


class SubmissionConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.SUBMISSION

    root_constraint_result: ZipConstraintResult | FileConstraintResult
    global_constraint_result: GlobalConstraintResult


class GlobalConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.GLOBAL

    sub_constraint_results: list[ConstraintResult]


class FileConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.FILE
    file_name: str


class ZipConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.ZIP
    zip_name: str
    sub_constraint_results: list[ConstraintResult]


class DirectoryConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.DIRECTORY
    directory_name: str
    sub_constraint_results: list[ConstraintResult]


class NotPresentConstraintResult(ConstraintResult):
    file_or_directory_name: str
    type: ConstraintType = ConstraintType.NOT_PRESENT


class ExtensionNotPresentConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.EXTENSION_NOT_PRESENT
    extension: str
    files_with_extension: list[str]
