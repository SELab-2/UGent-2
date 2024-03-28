from pydantic import BaseModel, EmailStr


class UserDataclass(BaseModel):
    """
    This user does not have any roles yet.
    When the roles become specified, use the almost equivalent APIUser.
    """

    id: int
    name: str
    language: str
    email: EmailStr
