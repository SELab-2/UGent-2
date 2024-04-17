import unittest

from httpx import Response
from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock


class TestSubjectAsStudent(unittest.TestCase):

    TESTED_USER_ID = 1

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

    @staticmethod
    def assert_status_code(response: Response, expected_status_code: int) -> None:
        assert response.status_code == expected_status_code, \
            f"Expected status code {expected_status_code}, but got {response.status_code}"

    @staticmethod
    def assert_json_length(response: Response, expected_length: int) -> None:
        json_data = response.json()
        assert len(json_data) == expected_length, f"Expected JSON length {expected_length}, but got {len(json_data)}"

    def login_as(self, uid: int) -> str:
        response = self.client.post(f"/api/fake-login?uid={uid}")
        self.assert_status_code(response, status.HTTP_200_OK)
        token = response.json().get("token")
        assert token
        self.token = token
        return token

    def test_fake_login(self) -> None:
        self.login_as(1)

    def test_subjects(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/student/subjects")
        self.assert_status_code(response, status.HTTP_200_OK)
        self.assert_json_length(response, 3)

    def test_join_subject_already_enrolled(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "post", "/api/student/subjects/1/join")
        self.assert_status_code(response, status.HTTP_400_BAD_REQUEST)

    def test_leave_and_join_subject(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "post", "/api/student/subjects/1/leave")
        self.assert_status_code(response, status.HTTP_200_OK)

        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/student/subjects")
        self.assert_status_code(response, status.HTTP_200_OK)
        self.assert_json_length(response, 2)

        response = self.make_authenticated_request(self.TESTED_USER_ID, "post", "/api/student/subjects/1/join")
        self.assert_status_code(response, status.HTTP_200_OK)

        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/student/subjects")
        self.assert_status_code(response, status.HTTP_200_OK)
        self.assert_json_length(response, 3)

    def test_projects(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/student/projects")
        self.assert_status_code(response, status.HTTP_200_OK)
        self.assert_json_length(response, 4)


if __name__ == "__main__":
    unittest.main()
