from dataclasses import dataclass

from domain.models.base_model import JsonRepresentable


@dataclass()
class UserDataclass(JsonRepresentable):
    name: str
    email: str
    id: int | None = None
