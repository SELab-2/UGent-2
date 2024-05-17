import os
from typing import Any

from httpx import Response
from starlette import status
from starlette.testclient import TestClient

os.environ["DELPHI_DEBUG"] = "1"


def assert_status_code(response: Response, expected_status_code: int) -> None:
    assert response.status_code == expected_status_code, \
        f"Expected status code {expected_status_code}, but got {response.status_code}"


def assert_json_length(response: Response, expected_length: int) -> None:
    json_data = response.json()
    assert len(json_data) == expected_length, f"Expected JSON length {expected_length}, but got {len(json_data)}"


def make_authenticated_request(client: TestClient, user_id: int, method: str, url: str,
                               **kwargs: dict[Any, Any] | list[str]) -> Response:
    token = login_as(client, user_id)
    headers = {"Authorization": f"Bearer {token}"}
    return getattr(client, method)(url, headers=headers, **kwargs)


def login_as(client: TestClient, uid: int) -> str:
    response = client.post(f"/api/fake-login?uid={uid}")
    assert_status_code(response, status.HTTP_200_OK)
    token = response.json().get("token")
    assert token
    return token
