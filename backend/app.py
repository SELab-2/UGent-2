import os

import uvicorn
from fastapi import FastAPI

from db.extensions import db
from routes.teachers import teachers_router

app = FastAPI()

# Koppel routes uit andere modules.
app.include_router(teachers_router, prefix="/teachers")

db.init_app(app)

if __name__ == "__main__":
    uvicorn.run("fastapi_code:app")
