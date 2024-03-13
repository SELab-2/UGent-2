import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette import status
from starlette.requests import Request
from starlette.responses import JSONResponse

from db.errors.database_errors import ActionAlreadyPerformedError, ItemNotFoundError, NoSuchRelationError
from routes.errors.authentication import InvalidRoleCredentialsError, InvalidTokenError, NoAccessToSubjectError
from routes.group import group_router
from routes.login import login_router
from routes.project import project_router
from routes.student import student_router
from routes.subject import subject_router
from routes.teacher import teacher_router
from routes.user import users_router

app = FastAPI()

# Koppel routes uit andere modules.
app.include_router(login_router, prefix="/api")
app.include_router(student_router, prefix="/api")
app.include_router(teacher_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(project_router, prefix="/api")
app.include_router(subject_router, prefix="/api")
app.include_router(group_router, prefix="/api")

DEBUG = False  # Should always be false in repo

if DEBUG:
    from fastapi.middleware.cors import CORSMiddleware

    origins = [
        "https://localhost",
        "https://localhost:8080",
        "http://localhost:5173",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


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


@app.exception_handler(NoAccessToSubjectError)
def no_access_to_subject_error_handler(request: Request, exc: NoAccessToSubjectError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content={"detail": str(exc)},
    )


@app.exception_handler(ActionAlreadyPerformedError)
def action_already_performed_error_handler(request: Request, exc: ActionAlreadyPerformedError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )


@app.exception_handler(NoSuchRelationError)
def no_such_relation_error_handler(request: Request, exc: NoSuchRelationError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )


@app.exception_handler(InvalidTokenError)
def invalid_token_error_handler(request: Request, exc: NoSuchRelationError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": str(exc)},
    )


if __name__ == "__main__":
    uvicorn.run("app:app")
