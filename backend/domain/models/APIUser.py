from pydantic import BaseModel, EmailStr


class APIUser(BaseModel):
    id: int
    name: str
    email: EmailStr
    roles: list[str]
