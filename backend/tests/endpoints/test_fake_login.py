import unittest

from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock


class TestStudentView(unittest.TestCase):
    token = None

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()

    def tearDown(self) -> None:
        pass

    def login_as(self, uid: int) -> str:
        response = self.client.post(f"/api/fake-login?uid={uid}")
        assert response.status_code == status.HTTP_200_OK, f"Should be 200 OK but was {response.status_code}"
        token = response.json().get("token")
        assert token
        return token

    def test_fake_login(self) -> None:
        self.login_as(1)

    def test_authenticated_endpoint(self) -> None:
        # Use the token from the class variable
        token = self.login_as(1)
        assert token is not None, "Token is None. Make sure test_fake_login ran successfully."
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get("/api/student/subjects", headers=headers)
        assert response.status_code == status.HTTP_200_OK, f"Should be 200 OK but was {response.status_code}"


if __name__ == "__main__":
    unittest.main()
