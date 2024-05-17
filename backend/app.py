import pathlib

import uvicorn
from fastapi import Depends, FastAPI
from fastapi.security import HTTPBearer

from config import DEBUG
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


if __name__ == "__main__":
    uvicorn.run("app:app")
