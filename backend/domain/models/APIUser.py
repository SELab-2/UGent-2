from pydantic import BaseModel, EmailStr

from domain.logic.role_enum import Role


class APIUser(BaseModel):
    """
    Same as UserDataclass, but with the roles specified in a list.
    """
    id: int
    name: str
    email: EmailStr
    roles: list[Role]


class LoginResponse(BaseModel):
    token: str
