from fastapi import APIRouter
from pydantic import BaseModel
from starlette.requests import Request

from db.models import User
from routes.authentication.authentication_controller import authenticate_user
from routes.authentication.errors import InvalidAuthenticationError
from routes.authentication.token_controller import create_token, verify_token
from routes.tags.swagger_tags import Tags

# test url: https://login.ugent.be/login?service=https://localhost:8080/api/login
login_router = APIRouter()


class LoginResponse(BaseModel):
    token: str


class ValidateResponse(BaseModel):
    valid: bool


@login_router.post("/validate", tags=[Tags.LOGIN], summary="Validate a session token.")
def validate_token(token: str) -> ValidateResponse:
    uid = verify_token(token)
    if uid:
        return ValidateResponse(valid=True)
    return ValidateResponse(valid=False)


@login_router.post("/login", tags=[Tags.LOGIN], summary="Starts a session for the user.")
def login(request: Request, ticket: str) -> LoginResponse:
    """
    This function starts a session for the user.
    For authentication, it uses the given ticket and the UGent CAS server (https://login.ugent.be).

    :param request: Request: The request object.
    :param ticket: str:  A UGent CAS ticket that will be used for authentication.
    :return:
        - Valid Ticket: Response: with a JWT token;
        - Invalid Ticket: Response: with status_code 401 (unauthenticated) and an error message
    """
    session = request.state.session
    user: User | None = authenticate_user(session, ticket)
    if not user:
        raise InvalidAuthenticationError
    return LoginResponse(token=create_token(user))
