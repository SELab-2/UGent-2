from dataclasses import dataclass
from datetime import datetime

from domain.models.base_model import JsonRepresentable


@dataclass()
class ProjectDataclass(JsonRepresentable):
    id: int
    name: str
    deadline: datetime
    archived: bool
    description: str
    requirements: str
    visible: bool
    max_students: int
    subject_id: int
