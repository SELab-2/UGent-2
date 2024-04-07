import contextlib
import os
from datetime import UTC, datetime, timedelta

import jwt

from db.models import User

# Zeker aanpassen in production
jwt_secret = os.getenv("JWT_SECRET", "secret")


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
