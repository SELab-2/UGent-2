import contextlib
import secrets
from datetime import UTC, datetime, timedelta

import jwt
from sqlalchemy.exc import ProgrammingError
from sqlmodel import Session

from db.extensions import engine
from db.models import Config, User

with Session(engine) as session:
    jwt_secret_obj = None
    with contextlib.suppress(ProgrammingError):
        jwt_secret_obj = session.get(Config, "jwt_secret")
    jwt_secret = jwt_secret_obj.value if jwt_secret_obj else secrets.token_urlsafe(64)


def verify_token(token: str) -> int | None:
    with contextlib.suppress(jwt.ExpiredSignatureError, jwt.DecodeError):
        payload = jwt.decode(token, jwt_secret, algorithms=["HS256"])
        return payload.get("uid", None)


def create_token(user: User) -> str:
    expire = datetime.now(UTC) + timedelta(days=1)
    to_encode: dict = {
        "uid": user.id,
        "exp": expire,
    }
    return jwt.encode(to_encode, jwt_secret, algorithm="HS256")
