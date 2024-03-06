import uvicorn
from fastapi import FastAPI
from starlette import status
from starlette.requests import Request
from starlette.responses import JSONResponse

from db.errors.database_errors import ActionAlreadyPerformedError, ItemNotFoundError
from routes.errors.authentication import InvalidRoleCredentialsError, StudentNotEnrolledError
from routes.student import student_router
from routes.teacher import teacher_router
from routes.user import users_router

app = FastAPI()

# Koppel routes uit andere modules.
app.include_router(student_router, prefix="/api")
app.include_router(teacher_router, prefix="/api")
app.include_router(users_router, prefix="/api")


# Koppel de exception handlers
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


if __name__ == "__main__":
    uvicorn.run("app:app")
