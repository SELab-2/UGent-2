from dataclasses import dataclass

from domain.models.base_model import JsonRepresentable


@dataclass()
class SubjectDataclass(JsonRepresentable):
    id: int
    name: str
