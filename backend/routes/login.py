from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from controllers.auth.authentication_controller import authenticate_user
from controllers.auth.token_controller import create_token
from controllers.properties.Properties import Properties
from db.sessions import get_session
from domain.models.UserDataclass import UserDataclass

# test url: https://login.ugent.be/login?service=https://localhost:8080/api/login
login_router = APIRouter()
props: Properties = Properties()


@login_router.get("/login")
def login(
        ticket: str,
        session: Session = Depends(get_session),
) -> Response:
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
    if user:
        return Response(content=create_token(user))
    return Response(status_code=401, content="Invalid Ticket!")


# TODO proper handle logout
@login_router.get("/logout")
def logout() -> Response:
    """
    This function will log a user out, by removing the session from storage

    :return: A confirmation that the logout was successful, and it tells the browser to remove the cookie.
    """
    response: Response = Response(content="You've been successfully logged out")
    response.set_cookie("token", "")
    return response
