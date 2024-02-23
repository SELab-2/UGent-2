import json
import unittest
from http import HTTPStatus

from backend.routes.index import app


class LesgeverTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_create_teacher_bad_request(self):
        response = self.app.post("/teachers", data=json.dumps({}), content_type="application/json")
        self.assertEqual(HTTPStatus.BAD_REQUEST, response.status_code)
        self.assertIn("error", json.loads(response.data))

    def test_create_teacher_success(self):
        teacher_data = {
            "name": "Bart De Bruyn"
        }
        response = self.app.post("/teachers", data=json.dumps(teacher_data), content_type="application/json")
        self.assertEqual(HTTPStatus.CREATED, response.status_code)


if __name__ == "__main__":
    unittest.main()
