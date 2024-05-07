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
    EXTENSION_ONLY_PRESENT = "EXTENSION_ONLY_PRESENT"
    GLOBAL = "GLOBAL"


class ConstraintResult(BaseModel):
    type: ConstraintType
    is_ok: bool
    sub_constraint_results: list[SubConstraintResult] = []


class SubmissionConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.SUBMISSION

    root_constraint_result: ZipConstraintResult | FileConstraintResult
    global_constraint_result: GlobalConstraintResult


class GlobalConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.GLOBAL
    global_constraint_results: dict[str, list[NotPresentConstraintResult |
                                              ExtensionNotPresentConstraintResult |
                                              ExtensionOnlyPresentConstraintResult]]


class FileConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.FILE
    file_name: str


class ZipConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.ZIP
    zip_name: str


class DirectoryConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.DIRECTORY
    directory_name: str


class NotPresentConstraintResult(ConstraintResult):
    file_or_directory_name: str
    type: ConstraintType = ConstraintType.NOT_PRESENT


class ExtensionNotPresentConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.EXTENSION_NOT_PRESENT
    extension: str
    files_with_extension: list[str]


class ExtensionOnlyPresentConstraintResult(ConstraintResult):
    type: ConstraintType = ConstraintType.EXTENSION_ONLY_PRESENT
    extension: str
    files_without_extension: list[str]


SubConstraintResult = (
        DirectoryConstraintResult
        | FileConstraintResult
        | NotPresentConstraintResult
        | ExtensionNotPresentConstraintResult
        | ExtensionOnlyPresentConstraintResult
)
