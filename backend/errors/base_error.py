from fastapi import HTTPException
from starlette import status


class ExceptionBase(HTTPException):
    detail = "An error occurred"
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

    def __init__(self) -> None:
        super().__init__(
            status_code=self.status_code,
            detail=self.detail,
        )
