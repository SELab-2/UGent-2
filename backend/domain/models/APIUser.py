from pydantic import BaseModel, EmailStr

from domain.logic.role_enum import Role


class APIUser(BaseModel):
    id: int
    name: str
    email: EmailStr
    roles: list[Role]


class LoginResponse(BaseModel):
    token: str
