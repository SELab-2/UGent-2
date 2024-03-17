from pydantic import BaseModel

from domain.simple_submission_checks.constraints.file_constraint import FileConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint


class SubmissionConstraint(BaseModel):
    root_constraint: ZipConstraint | FileConstraint

    def validate(self, path: str):
        self.root_constraint.validate_constraint(path)
