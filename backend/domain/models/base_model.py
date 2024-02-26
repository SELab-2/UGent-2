import dataclasses
from dataclasses import dataclass


@dataclass()
class JsonRepresentable:
    def to_dict(self) -> dict:
        return dataclasses.asdict(self)
