import pathlib

import uvicorn
from fastapi import Depends, FastAPI
from fastapi.security import HTTPBearer
from starlette import status
from starlette.requests import Request
from starlette.responses import JSONResponse

from controllers.authentication.errors import (
    InvalidAuthenticationError,
    InvalidRoleCredentialsError,
    NoAccessToDataError,
)
from controllers.middleware import DatabaseSessionMiddleware
from controllers.routes.course import course_router
from controllers.routes.group import group_router
from controllers.routes.login import login_router
from controllers.routes.project import project_router
from controllers.routes.student import student_router
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
from debug import DEBUG
from domain.logic.errors import (
    ArchivedError,
    InvalidConstraintsError,
    InvalidSubmissionError,
    NotATeacherError,
    UserNotEnrolledError,
)

pathlib.Path.mkdir(pathlib.Path("submissions"), exist_ok=True)
app = FastAPI(
    docs_url="/api/docs",
    openapi_tags=tags_metadata,
    swagger_ui_parameters={"persistAuthorization": True},
    dependencies=[Depends(HTTPBearer(auto_error=False))],  # To authenticate via Swagger UI
)

# Koppel controllers uit andere modules.
app.include_router(login_router, prefix="/api")
app.include_router(student_router, prefix="/api")
app.include_router(teacher_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(project_router, prefix="/api")
app.include_router(course_router, prefix="/api")
app.include_router(group_router, prefix="/api")
app.include_router(submission_router, prefix="/api")

# Add Middlewares
app.add_middleware(DatabaseSessionMiddleware)


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
        content={"detail": exc.ERROR_MESSAGE},
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


@app.exception_handler(InvalidConstraintsError)
def invalid_constraints_error_handler(request: Request, exc: InvalidConstraintsError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": exc.ERROR_MESSAGE},
    )


@app.exception_handler(InvalidSubmissionError)
def invalid_submission_error_handler(request: Request, exc: InvalidSubmissionError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": exc.ERROR_MESSAGE},
    )


@app.exception_handler(UserNotEnrolledError)
def user_not_enrolled_error_handler(request: Request, exc: UserNotEnrolledError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": exc.ERROR_MESSAGE},
    )


@app.exception_handler(ArchivedError)
def archived_error_handler(request: Request, exc: ArchivedError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": exc.ERROR_MESSAGE},
    )


@app.exception_handler(NotATeacherError)
def not_a_teacher_error_handler(request: Request, exc: NotATeacherError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": exc.ERROR_MESSAGE},
    )


if __name__ == "__main__":
    uvicorn.run("app:app")
