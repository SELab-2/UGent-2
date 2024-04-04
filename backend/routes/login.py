from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from controllers.auth.authentication_controller import authenticate_user
from controllers.auth.token_controller import create_token, verify_token
from db.sessions import get_session
from domain.models.APIUser import LoginResponse, ValidateResponse
from domain.models.UserDataclass import UserDataclass
from routes.errors.authentication import InvalidAuthenticationError
from routes.tags.swagger_tags import Tags

# test url: https://login.ugent.be/login?service=https://localhost:8080/api/login
login_router = APIRouter()


@login_router.post("/validate", tags=[Tags.LOGIN], summary="Validate a session token.")
def validate_token(
    token: str,
) -> ValidateResponse:
    uid = verify_token(token)
    if uid:
        return ValidateResponse(valid=True)
    return ValidateResponse(valid=False)


@login_router.post("/login", tags=[Tags.LOGIN], summary="Starts a session for the user.")
def login(
    ticket: str,
    session: Session = Depends(get_session),
) -> LoginResponse:
    """
    This function starts a session for the user.
    For authentication, it uses the given ticket and the UGent CAS server (https://login.ugent.be).

    :param session:
    :param ticket: str:  A UGent CAS ticket that will be used for authentication.
    :return:
        - Valid Ticket: Response: with a JWT token;
        - Invalid Ticket: Response: with status_code 401 (unauthenticated) and an error message
    """
    user: UserDataclass | None = authenticate_user(session, ticket)
    if not user:
        raise InvalidAuthenticationError
    return LoginResponse(token=create_token(user))
