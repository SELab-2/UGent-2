from fastapi import Request, status
from fastapi.responses import JSONResponse

from app import app
from db.errors.database_errors import ActionAlreadyPerformedError, ItemNotFoundError
from routes.errors.authentication import InvalidRoleCredentialsError, StudentNotEnrolledError


@app.exception_handler(InvalidRoleCredentialsError)
def invalid_admin_credentials_error_handler(request: Request, exc: InvalidRoleCredentialsError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content={"message": exc.ERROR_MESSAGE},
    )


@app.exception_handler(ItemNotFoundError)
def item_not_found_error_handler(request: Request, exc: ItemNotFoundError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": str(exc)},
    )


@app.exception_handler(StudentNotEnrolledError)
def student_already_enrolled_error_handler(request: Request, exc: StudentNotEnrolledError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )


@app.exception_handler(ActionAlreadyPerformedError)
def action_already_performed_error_handler(request: Request, exc: ActionAlreadyPerformedError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )
