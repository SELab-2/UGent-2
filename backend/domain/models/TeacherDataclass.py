from dataclasses import dataclass

from domain.models.base_model import JsonRepresentable


@dataclass()
class TeacherDataclass(JsonRepresentable):
    id: int
    subject_ids: list[int] | None = None
