from dataclasses import dataclass

from domain.models.base_model import JsonRepresentable


@dataclass()
class GroupDataclass(JsonRepresentable):
    id: int
    project_id: int
