import uvicorn
from fastapi import FastAPI

from routes.subjects import subjects_router
from routes.users import users_router

app = FastAPI()

# Koppel routes uit andere modules.
app.include_router(subjects_router, prefix="/api")
app.include_router(users_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("app:app")
