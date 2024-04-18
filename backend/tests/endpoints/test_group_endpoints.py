import unittest

from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_status_code, login_as, make_authenticated_request


class TestGroupEndpoints(unittest.TestCase):
    TESTED_USER_ID = 1  # Assuming the user ID is 1

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        self.token = None

    def tearDown(self) -> None:
        pass

    def test_fake_login(self) -> None:
        login_as(self.client, 1)

    def test_join_group(self) -> None:
        response = make_authenticated_request(self.client, 2, "post", "/api/groups/4/join")
        assert_status_code(response, status.HTTP_400_BAD_REQUEST)

    def test_leave_group(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", "/api/groups/1/leave")
        assert_status_code(response, status.HTTP_200_OK)

    def test_list_group_members(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/groups/1/members")
        assert_status_code(response, status.HTTP_200_OK)

    def test_get_group_for_project(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/projects/1/group")
        assert_status_code(response, status.HTTP_200_OK)

    def test_remove_student_from_group(self) -> None:
        response = make_authenticated_request(self.client, 9, "post", "/api/groups/1/remove?uid=2")
        assert_status_code(response, status.HTTP_200_OK)


if __name__ == "__main__":
    unittest.main()
