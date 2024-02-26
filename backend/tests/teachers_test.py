import json
import unittest
from http import HTTPStatus

from app import app


class LesgeverTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.app = app.test_client()
        self.app.testing = True

    def test_create_teacher_bad_request(self) -> None:
        response = self.app.post("/teachers", data=json.dumps({}), content_type="application/json")
        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert "error" in json.loads(response.data)

    def test_create_teacher_success(self) -> None:
        teacher_data = {"name": "Bart De Bruyn"}
        response = self.app.post("/teachers", data=json.dumps(teacher_data), content_type="application/json")
        assert response.status_code == HTTPStatus.CREATED


if __name__ == "__main__":
    unittest.main()
