from pydantic import BaseModel


class SubjectInput(BaseModel):
    name: str
