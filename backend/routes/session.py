from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from controllers.auth.session_controller import DOMAIN, MAX_AGE, get_user_information, login_user

session_router = APIRouter()


@session_router.get("/session")
def get_session(ticket: str) -> JSONResponse:
    user_information: dict = get_user_information(ticket)
    if user_information:
        session_id = login_user(user_information)
        response: JSONResponse = JSONResponse(content=user_information)
        response.set_cookie(
            key="session_id",
            value=session_id,
            max_age=MAX_AGE,
            domain=DOMAIN,
            secure=True)
        return response
    raise HTTPException(status_code=401, detail="Invalid Token!")
