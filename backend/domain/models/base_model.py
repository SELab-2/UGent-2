import dataclasses
from abc import ABC
from dataclasses import dataclass


@dataclass()
class JsonRepresentable(ABC):
    def to_dict(self) -> dict:
        return dataclasses.asdict(self)
