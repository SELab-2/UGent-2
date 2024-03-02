from dataclasses import dataclass

from pydantic import BaseModel


@dataclass()
class SubjectDataclass(BaseModel):
    id: int
    name: str
