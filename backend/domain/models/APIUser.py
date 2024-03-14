from pydantic import BaseModel, EmailStr

from domain.logic.role_enum import Role


class APIUser(BaseModel):
    """
    A user with that has is roles specified.
    """
    id: int
    name: str
    email: EmailStr
    roles: list[Role]
