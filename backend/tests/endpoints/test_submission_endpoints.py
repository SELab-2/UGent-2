import unittest

from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_status_code, login_as, make_authenticated_request


class TestSubmissionEndpoints(unittest.TestCase):
    TESTED_USER_ID = 1  # Assuming the user ID is 1

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        self.token = None

    def tearDown(self) -> None:
        pass

    def test_fake_login(self) -> None:
        login_as(self.client, 1)

    def test_retrieve_submission(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/groups/1/submission")
        assert_status_code(response, status.HTTP_200_OK)


if __name__ == "__main__":
    unittest.main()
