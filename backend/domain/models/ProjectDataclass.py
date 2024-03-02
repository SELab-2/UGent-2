from dataclasses import dataclass
from datetime import datetime

from pydantic import BaseModel, PositiveInt


@dataclass()
class ProjectDataclass(BaseModel):
    id: int
    name: str
    deadline: datetime
    archived: bool
    description: str
    requirements: str
    visible: bool
    max_students: PositiveInt
    subject_id: int
