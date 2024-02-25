from dataclasses import dataclass

from domain.models.base_model import JsonRepresentable


@dataclass()
class SubjectDataclass(JsonRepresentable):
    name: str
    id: int | None = None
    teacher_ids: list[int] | None = None
    student_ids: list[int] | None = None
    project_ids: list[int] | None = None
