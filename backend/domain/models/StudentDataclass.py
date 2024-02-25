from dataclasses import dataclass

from domain.models.base_model import JsonRepresentable


@dataclass()
class StudentDataclass(JsonRepresentable):
    id: int
