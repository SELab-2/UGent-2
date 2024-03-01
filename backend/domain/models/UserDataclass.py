from dataclasses import dataclass

from pydantic import BaseModel, EmailStr


@dataclass()
class UserDataclass(BaseModel):
    id: int
    name: str
    email: EmailStr
