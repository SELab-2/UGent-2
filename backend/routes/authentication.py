from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse

from controllers.auth.authentication_controller import authenticate_user
from controllers.auth.cookie_controller import delete_cookie, set_cookies
from controllers.auth.encryption_controller import delete_key
from controllers.auth.login_controller import verify_session

session_router = APIRouter()


@session_router.get("/api/login")
def login(ticket: str) -> JSONResponse:
    """
    This function start a session for the user.
    For authentication, it uses the given ticket and the UGent CAS server (https://login.ugent.be).

    :param ticket: A UGent CAS ticket that will be used for the authentication
    :return:
        - Valid Ticket: A JSONResponse with a user object; a cookie will be set with a session_id
        - Invalid Ticket: A JSONResponse with status_code 401 and an error message
    """
    user: dict = authenticate_user(ticket)  # This should be a user object
    if user:
        response: JSONResponse = JSONResponse(content=user)
        # TODO: Change mail to user id
        print("here")
        response = set_cookies(response, "session_id", user["mail"])
        return response
    return JSONResponse(status_code=401, content="Invalid Ticket")


@session_router.get("/api/logout/{user_id}")
def logout(user_id: str) -> Response:
    """
    This function will log a user out, by removing the session from storage

    :param user_id: An identifier of the user that needs to be logged out
    :return: A confirmation that the logout was successful, and it tells the browser to remove the cookie.
    """
    response: Response = Response(content="You've been successfully logged out")

    delete_cookie(response, "session_id")
    delete_key(user_id)
    return response


@session_router.get("/api/session/verify/{user_id}")
def verify(request: Request, user_id: str) -> bool:
    """
    A test route to check if the user has a valid session
    :param request: Http Request filled in by fastapi
    :param user_id: identifier for the user
    :return: boolean that says if the user is logged in
    """
    return verify_session(request, user_id)
