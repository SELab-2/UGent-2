from dataclasses import dataclass

from pydantic import BaseModel


@dataclass()
class UserDataclass(BaseModel):
    id: int
    # pydanitc will throw an error when creating a new user
    name: str
    email: str


@dataclass()
class UserDataClassRequest(BaseModel):
    name: str
    email: str
