from dataclasses import dataclass

from domain.models.base_model import JsonRepresentable


@dataclass()
class StudentDataclass(JsonRepresentable):
    id: int
    subject_ids: list[int] | None = None
    group_ids: list[int] | None = None
    submission_ids: list[int] | None = None
