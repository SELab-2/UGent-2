from datetime import datetime

from pydantic import BaseModel, PositiveInt


class ProjectInput(BaseModel):
    name: str
    deadline: datetime
    archived: bool
    description: str
    requirements: str
    visible: bool
    max_students: PositiveInt
