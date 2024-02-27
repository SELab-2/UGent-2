from dataclasses import dataclass

from pydantic import BaseModel


@dataclass()
class UserDataclass(BaseModel):
    id: int | None  # needs to be optional because it is not known when creating a new user otherwise
    # pydanitc will throw an error when creating a new user
    name: str
    email: str
