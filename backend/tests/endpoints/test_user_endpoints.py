import unittest
from typing import Any

from httpx import Response
from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_status_code


class TestUserEndpoints(unittest.TestCase):
    TESTED_USER_ID = 1  # Assuming the user ID is 1

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        self.token = None

    def tearDown(self) -> None:
        pass

    def make_authenticated_request(self, user_id: int, method: str, url: str, **kwargs: dict[Any, Any]) -> Response:
        token = self.login_as(user_id)
        headers = {"Authorization": f"Bearer {token}"}
        return getattr(self.client, method)(url, headers=headers, **kwargs)

    def login_as(self, uid: int) -> str:
        response = self.client.post(f"/api/fake-login?uid={uid}")
        assert_status_code(response, status.HTTP_200_OK)
        token = response.json().get("token")
        assert token
        self.token = token
        return token

    def test_fake_login(self) -> None:
        self.login_as(1)

    def test_get_current_user(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/user")
        assert_status_code(response, status.HTTP_200_OK)

    def test_modify_current_user(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "put", "/api/user",
                                                   params={"language": "EN"})
        assert_status_code(response, status.HTTP_204_NO_CONTENT)

    def test_get_users(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/users")
        assert_status_code(response, status.HTTP_200_OK)

    def test_admin_get_user(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/users/1")
        assert_status_code(response, status.HTTP_200_OK)

    def test_modify_user_fail(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "put", "/api/users/1",
                                                   json={"roles": ["STUDENT", "ADMIN", "TEACHER"]})
        assert_status_code(response, status.HTTP_422_UNPROCESSABLE_ENTITY)

    def test_modify_user_pass(self) -> None:
        response = self.make_authenticated_request(12, "put", "/api/users/1",
                                                   json=["STUDENT", "ADMIN", "TEACHER"])
        assert_status_code(response, status.HTTP_204_NO_CONTENT)


if __name__ == "__main__":
    unittest.main()
