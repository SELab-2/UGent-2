import unittest

from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_status_code, login_as, make_authenticated_request


class TestUserEndpoints(unittest.TestCase):
    TESTED_USER_ID = 1  # Assuming the user ID is 1

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        self.token = None

    def tearDown(self) -> None:
        pass

    def test_fake_login(self) -> None:
        login_as(self.client, 1)

    def test_get_current_user(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/user")
        assert_status_code(response, status.HTTP_200_OK)

    def test_modify_current_user(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "put", "/api/user",
                                              params={"language": "EN"})
        assert_status_code(response, status.HTTP_204_NO_CONTENT)

    def test_get_users(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/users")
        assert_status_code(response, status.HTTP_200_OK)

    def test_admin_get_user(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/users/1")
        assert_status_code(response, status.HTTP_200_OK)

    def test_modify_user_fail(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "put", "/api/users/1",
                                              json={"roles": ["STUDENT", "ADMIN", "TEACHER"]})
        assert_status_code(response, status.HTTP_422_UNPROCESSABLE_ENTITY)

    def test_modify_user_pass(self) -> None:
        response = make_authenticated_request(self.client, 12, "put", "/api/users/1",
                                              json=["STUDENT", "ADMIN", "TEACHER"])
        assert_status_code(response, status.HTTP_204_NO_CONTENT)


if __name__ == "__main__":
    unittest.main()
