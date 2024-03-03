import uvicorn
from fastapi import FastAPI

from routes.users import users_router

app = FastAPI()

# Koppel routes uit andere modules.
app.include_router(users_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("app:app")
