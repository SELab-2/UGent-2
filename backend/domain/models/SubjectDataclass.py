from pydantic import BaseModel


class SubjectDataclass(BaseModel):
    id: int
    name: str


class SubjectInput(BaseModel):
    name: str
