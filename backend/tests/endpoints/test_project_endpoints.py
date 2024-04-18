import unittest

from httpx import Response
from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_status_code


class TestProjectEndpoints(unittest.TestCase):
    TESTED_USER_ID = 9  # Assuming the user ID is 9

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        self.token = None

    def tearDown(self) -> None:
        pass

    def make_authenticated_request(self, user_id: int, method: str, url: str, **kwargs: dict[str, int]) -> Response:
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

    def test_get_project(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/projects/1")
        assert_status_code(response, status.HTTP_200_OK)

    def test_get_project_groups(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/projects/1/groups")
        assert_status_code(response, status.HTTP_200_OK)

    def test_create_group_in_project(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "post", "/api/projects/1/groups")
        assert_status_code(response, status.HTTP_200_OK)

    def test_update_project(self) -> None:
        project_data = {
            "name": "Updated Project",
            "deadline": "2024-12-31T23:59:59",
            "archived": False,
            "description": "Updated project description",
                "requirements": '{"type": "file_constraint", "name": "sort.py"}',
            "visible": True,
            "max_students": 5,
        }
        response = self.make_authenticated_request(self.TESTED_USER_ID, "put", "/api/projects/1", json=project_data)
        assert_status_code(response, status.HTTP_200_OK)


if __name__ == "__main__":
    unittest.main()
