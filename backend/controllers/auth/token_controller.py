import contextlib
import os
from datetime import UTC, datetime, timedelta

import jwt

from domain.models.UserDataclass import UserDataclass

jwt_secret = os.getenv("JWT_SECRET", "secret")


def verify_token(token: str) -> int | None:
    with contextlib.suppress(jwt.ExpiredSignatureError, jwt.DecodeError):
        payload = jwt.decode(token, jwt_secret)
        return payload.get("userid", None)


def create_token(user: UserDataclass) -> str:
    exprire = datetime.now(UTC) + timedelta(days=1)
    to_encode: dict = {
        "userid": user.id,
        "exp": exprire,
    }
    return jwt.encode(to_encode, jwt_secret)
