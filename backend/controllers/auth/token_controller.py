import contextlib
from datetime import UTC, datetime, timedelta

import jwt

from controllers.properties.Properties import Properties
from domain.models.UserDataclass import UserDataclass

props: Properties = Properties()


def verify_token(token: str) -> int | None:
    secret = props.get("session", "secret_key")
    algorithm = props.get("session", "algorithm")
    with contextlib.suppress(jwt.ExpiredSignatureError, jwt.DecodeError):
        payload = jwt.decode(token, secret, algorithms=[algorithm])
        return payload.get("userid", None)


def create_token(user: UserDataclass) -> str:
    exprire = datetime.now(UTC) + timedelta(minutes=int(props.get("session", "access_token_expire_minutes")))
    to_encode: dict = {
        "userid": user.id,
        "exp": exprire,
    }
    algorithm: str = props.get("session", "algorithm")
    secret: str = props.get("session", "secret_key")
    return jwt.encode(to_encode, secret, algorithm=algorithm)
