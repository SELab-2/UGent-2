import unittest

from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_status_code, login_as, make_authenticated_request

# Define constants for URLs
GET_SUBJECT_URL = "/api/subjects/1"
GET_SUBJECT_PROJECTS_URL = "/api/subjects/1/projects"
GET_SUBJECT_TEACHERS_URL = "/api/subjects/1/teachers"
GET_SUBJECT_STUDENTS_URL = "/api/subjects/1/students"
CREATE_PROJECT_IN_SUBJECT_URL = "/api/subjects/1/projects"
UPDATE_SUBJECT_URL = "/api/subjects/1"


class TestSubjectEndpoints(unittest.TestCase):
    TESTED_USER_ID = 1  # Assuming the user ID is 1

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        login_as(self.client, self.TESTED_USER_ID)

    def tearDown(self) -> None:
        pass

    def test_get_subject(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_SUBJECT_URL)
        assert_status_code(response, status.HTTP_200_OK)

    def test_get_subject_projects(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_SUBJECT_PROJECTS_URL)
        assert_status_code(response, status.HTTP_200_OK)

    def test_get_subject_teachers(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_SUBJECT_TEACHERS_URL)
        assert_status_code(response, status.HTTP_200_OK)

    def test_get_subject_students(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_SUBJECT_STUDENTS_URL)
        assert_status_code(response, status.HTTP_200_OK)

    def test_create_project_in_subject(self) -> None:
        project_data = {
            "name": "New Project",
            "deadline": "2024-12-31T23:59:59",
            "archived": False,
            "description": "Project description",
            "requirements": '{"type": "file_constraint", "name": "sort.py"}',
            "visible": True,
            "max_students": 5,
        }
        response = make_authenticated_request(self.client, 9, "post", CREATE_PROJECT_IN_SUBJECT_URL, json=project_data)
        assert_status_code(response, status.HTTP_200_OK)

    def test_update_subject(self) -> None:
        subject_data = {
            "name": "Updated Subject",
            "archived": False,
        }
        response = make_authenticated_request(self.client, 9, "put", UPDATE_SUBJECT_URL, json=subject_data)
        assert_status_code(response, status.HTTP_200_OK)


if __name__ == "__main__":
    unittest.main()
