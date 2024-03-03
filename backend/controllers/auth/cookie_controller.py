from fastapi import Request, Response

from controllers.auth.encryption_controller import encrypt, generate_keys
from controllers.properties.Properties import Properties

props: Properties = Properties()


def set_cookies(response: Response, key: str, value: str) -> Response:
    value: str = encrypt(value)
    max_age: int = int(props.get("session", "max_cookie_age"))
    domain: str = props.get("session", "cookie_domain")
    response.set_cookie(key=key,
                        value=value,
                        max_age=max_age,
                        domain=domain,
                        secure=False)
    return response


def get_cookie(request: Request, key: str) -> str:
    return request.cookies.get(key)


def delete_cookie(response: Response, cookie_tag: str) -> Response:
    response.delete_cookie(cookie_tag)
    return response
