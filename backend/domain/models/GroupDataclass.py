from dataclasses import dataclass

from domain.models.base_model import JsonRepresentable


@dataclass()
class GroupDataclass(JsonRepresentable):
    project_id: int
    id: int | None = None
