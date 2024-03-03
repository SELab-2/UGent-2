from fastapi import Request

from controllers.auth.cookie_controller import get_cookie
from controllers.auth.encryption_controller import decrypt
from controllers.properties.Properties import Properties

# test url: https://login.ugent.be/login?service=https://localhost:8080/api/login
props: Properties = Properties()


def verify_session(request: Request, user_id: str) -> bool:
    session: str = get_cookie(request, "session_id")
    if session:
        decryption = decrypt(user_id=user_id, encrypted_text=session)
        return user_id == decryption if decryption else False
    return False
