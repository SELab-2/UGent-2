import unittest
from typing import Any

from httpx import Response
from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock


class TestSubjectAsTeacher(unittest.TestCase):
    TESTED_USER_ID = 9

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
        self.login_as(self.TESTED_USER_ID)

    def test_subjects(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/teacher/subjects")
        self.assert_status_code(response, status.HTTP_200_OK)
        self.assert_json_length(response, 1)

    def test_get_teacher_of_subject(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/subjects/1/teachers")
        self.assert_status_code(response, status.HTTP_200_OK)
        self.assert_json_length(response, 2)

    def test_add_teacher_to_subject(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "post", "/api/teacher/subjects/1/add",
                                                   params={"teacher_id": 10})
        self.assert_status_code(response, status.HTTP_200_OK)

    def test_projects(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/teacher/projects")
        self.assert_status_code(response, status.HTTP_200_OK)
        self.assert_json_length(response, 2)

    def test_create_subject(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "post", "/api/teacher/subjects",
                                                   json={"name": "New Subject", "archived": False})
        self.assert_status_code(response, status.HTTP_200_OK)

        # test if the new subject is in the list
        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/teacher/subjects")
        self.assert_status_code(response, status.HTTP_200_OK)
        self.assert_json_length(response, 2)

    def test_leave_subject(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "post", "/api/teacher/subjects/1/leave")
        self.assert_status_code(response, status.HTTP_200_OK)

        # test if the subject is no longer in the list
        response = self.make_authenticated_request(self.TESTED_USER_ID, "get", "/api/teacher/subjects")
        self.assert_status_code(response, status.HTTP_200_OK)
        self.assert_json_length(response, 0)

    def test_add_teacher_to_subject_as_student(self) -> None:
        response = self.make_authenticated_request(1, "post", "/api/teacher/subjects/1/add",
                                                   params={"teacher_id": 10})
        self.assert_status_code(response, status.HTTP_403_FORBIDDEN)

    # try adding a user that is not a teacher to the subject
    def test_add_student_to_subject(self) -> None:
        response = self.make_authenticated_request(self.TESTED_USER_ID, "post", "/api/teacher/subjects/1/add",
                                                   params={"teacher_id": 1})
        self.assert_status_code(response, status.HTTP_400_BAD_REQUEST)


if __name__ == "__main__":
    unittest.main()
