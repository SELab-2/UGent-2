from dataclasses import dataclass

from pydantic import BaseModel


@dataclass()
class GroupDataclass(BaseModel):
    id: int
    project_id: int
