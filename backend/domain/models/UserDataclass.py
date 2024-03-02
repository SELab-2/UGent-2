from pydantic import BaseModel, EmailStr


class UserDataclass(BaseModel):
    id: int
    name: str
    email: EmailStr
