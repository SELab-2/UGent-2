from pydantic import BaseModel


class LoginResponse(BaseModel):
    token: str


class ValidateResponse(BaseModel):
    valid: bool
