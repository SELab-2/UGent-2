import base64

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives.asymmetric.padding import OAEP
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPrivateKey, RSAPublicKey

# TODO: Use database to manage keys instead of dict
keys: dict = {}


def generate_keys(user_id: str) -> RSAPublicKey:
    if user_id in keys:
        return keys[user_id].public_key()

    private_key: RSAPrivateKey = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )
    keys[user_id] = private_key
    return private_key.public_key()


def encrypt(user_id: str) -> str:
    key = generate_keys(user_id)
    encryption: bytes = key.encrypt(
        plaintext=user_id.encode(),
        padding=OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )
    return base64.b64encode(encryption).decode()


def decrypt(user_id: str, encrypted_text: str) -> str | None:
    if user_id in keys:
        private_key: RSAPrivateKey = keys[user_id]
        encryption: bytes = base64.b64decode(encrypted_text.encode())
        return private_key.decrypt(
            encryption,
            padding=OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None,
            ),
        ).decode()
    return None


def delete_key(user_id: str) -> None:
    keys.pop(user_id)
