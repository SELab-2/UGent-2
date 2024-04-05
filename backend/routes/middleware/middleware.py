from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from db.sessions import get_session


class DatabaseSessionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        try:
            session_generator = get_session()
            request.state.session = next(session_generator)
            response = await call_next(request)
        finally:
            request.state.session.close()
        return response
