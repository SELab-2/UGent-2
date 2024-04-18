import unittest

from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_status_code, login_as, make_authenticated_request


class TestProjectEndpoints(unittest.TestCase):
    TESTED_USER_ID = 9  # Assuming the user ID is 9

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        self.token = None

    def tearDown(self) -> None:
        pass

    def test_fake_login(self) -> None:
        login_as(self.client, 1)

    def test_get_project(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/projects/1")
        assert_status_code(response, status.HTTP_200_OK)

    def test_get_project_groups(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/projects/1/groups")
        assert_status_code(response, status.HTTP_200_OK)

    def test_create_group_in_project(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", "/api/projects/1/groups")
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
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "put", "/api/projects/1",
                                              json=project_data)
        assert_status_code(response, status.HTTP_200_OK)


if __name__ == "__main__":
    unittest.main()
