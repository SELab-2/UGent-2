from pydantic import BaseModel


class GroupDataclass(BaseModel):
    id: int
    project_id: int
