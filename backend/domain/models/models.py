import dataclasses
from abc import ABC
from dataclasses import dataclass


@dataclass()
class JsonRepresentable(ABC):

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


@dataclass()
class Vak(JsonRepresentable):
    naam: str
    lesgever_id: int = None
    id: int = None


@dataclass()
class Lesgever(JsonRepresentable):
    naam: str
    id: int = None
