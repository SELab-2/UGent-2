import pathlib

import uvicorn
from fastapi import Depends, FastAPI
from fastapi.security import APIKeyHeader
from starlette import status
from starlette.requests import Request
from starlette.responses import JSONResponse

from controllers.authentication.errors import (
    InvalidAuthenticationError,
    InvalidRoleCredentialsError,
    NoAccessToDataError,
)
from controllers.middleware import DatabaseSessionMiddleware
from controllers.routes.group import group_router
from controllers.routes.login import login_router
from controllers.routes.project import project_router
from controllers.routes.student import student_router
from controllers.routes.subject import subject_router
from controllers.routes.submission import submission_router
from controllers.routes.teacher import teacher_router
from controllers.routes.user import users_router
from controllers.swagger_tags import tags_metadata
from db.database_errors import (
    ActionAlreadyPerformedError,
    ConflictingRelationError,
    ItemNotFoundError,
    NoSuchRelationError,
)

pathlib.Path.mkdir(pathlib.Path("submissions"), exist_ok=True)
app = FastAPI(
    docs_url="/api/docs",
    openapi_tags=tags_metadata,
    dependencies=[Depends(APIKeyHeader(name="cas", auto_error=False))],  # To authenticate via Swagger UI
)

# Koppel controllers uit andere modules.
app.include_router(login_router, prefix="/api")
app.include_router(student_router, prefix="/api")
app.include_router(teacher_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(project_router, prefix="/api")
app.include_router(subject_router, prefix="/api")
app.include_router(group_router, prefix="/api")
app.include_router(submission_router, prefix="/api")

# Add Middlewares
app.add_middleware(DatabaseSessionMiddleware)

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


@app.exception_handler(NoAccessToDataError)
def no_access_to_data_error_handler(request: Request, exc: NoAccessToDataError) -> JSONResponse:
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


@app.exception_handler(InvalidAuthenticationError)
def invalid_authentication_error_handler(request: Request, exc: NoSuchRelationError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": str(exc)},
    )


@app.exception_handler(ConflictingRelationError)
def conflicting_relation_error_handler(request: Request, exc: ConflictingRelationError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )


if __name__ == "__main__":
    uvicorn.run("app:app")
