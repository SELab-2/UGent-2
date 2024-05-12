# Voor de global constraint kan enkel de extension not present en de not present constraint gebruikt worden.
import os
from pathlib import Path

from pydantic import BaseModel

from domain.simple_submission_checks.constraints.constraint_result import ConstraintType, GlobalConstraintResult
from domain.simple_submission_checks.constraints.extension_not_present_constraint import ExtensionNotPresentConstraint
from domain.simple_submission_checks.constraints.extension_only_present_constraint import ExtensionOnlyPresentConstraint
from domain.simple_submission_checks.constraints.not_present_constraint import NotPresentConstraint


class GlobalConstraint(BaseModel):
    type: ConstraintType = ConstraintType.GLOBAL
    constraints: list[ExtensionNotPresentConstraint | NotPresentConstraint | ExtensionOnlyPresentConstraint]

    # Een lijst van folders en hun constraint results.
    # Voor elke folder de constraints uitvoeren en het resultaat daarvan opslaan.
    # ["folder1": [constraint1_result, constraint2_result], "folder2": [constraint1_result, constraint2_result]]
    def validate_constraint(self, path: Path) -> GlobalConstraintResult:
        sub_folders = [sub_file for sub_file in path.rglob("*") if sub_file.is_dir()] + [path]
        folder_results = {}
        for folder in sub_folders:
            faulty_results = []
            for constraint in self.constraints:
                result = constraint.validate_constraint(folder)
                if not result.is_ok:
                    faulty_results.append(result)

            if faulty_results:
                relative_path = os.path.relpath(folder, path)
                folder_results[str(relative_path)] = faulty_results

        return GlobalConstraintResult(
            is_ok=folder_results == {},
            global_constraint_results=folder_results,
        )
