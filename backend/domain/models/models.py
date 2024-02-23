import dataclasses
from abc import ABC
from dataclasses import dataclass


@dataclass()
class JsonRepresentable(ABC):

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


@dataclass()
class SubjectDataclass(JsonRepresentable):
    name: str
    teacher_id: int = None
    id: int = None


@dataclass()
class TeacherDataclass(JsonRepresentable):
    name: str
    id: int = None
