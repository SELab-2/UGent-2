import dataclasses
from dataclasses import dataclass


# what is the use of this class when one can use pydantic models?
@dataclass()
class JsonRepresentable:
    def to_dict(self) -> dict:
        return dataclasses.asdict(self)
