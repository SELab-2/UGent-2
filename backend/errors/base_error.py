from fastapi import HTTPException
from starlette import status


class ExceptionBase(HTTPException):
    ERROR_MESSAGE = "An error occurred"
    STATUS_CODE = status.HTTP_500_INTERNAL_SERVER_ERROR

    def __init__(self) -> None:
        super().__init__(
            status_code=self.STATUS_CODE,
            detail=self.ERROR_MESSAGE,
        )
