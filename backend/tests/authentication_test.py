import unittest

from fastapi.testclient import TestClient

from app import app


class AuthenticationTest(unittest.TestCase):
    def setUp(self) -> None:
        self.app = TestClient(app)


if __name__ == "__main__":
    unittest.main()
