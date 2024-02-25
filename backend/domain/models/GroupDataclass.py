from dataclasses import dataclass

from domain.models.base_model import JsonRepresentable


@dataclass()
class GroupDataclass(JsonRepresentable):
    project_id: int
    id: int | None = None
    student_ids: list[int] | None = None
    submission_ids: list[int] | None = None
