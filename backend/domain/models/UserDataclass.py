from dataclasses import dataclass

from domain.models.base_model import JsonRepresentable


@dataclass()
class UserDataclass(JsonRepresentable):
    id: int
    name: str
    email: str
