import json
import unittest
from http import HTTPStatus

from backend.routes.index import app


class LesgeverTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_create_lesgever_bad_request(self):
        response = self.app.post("/lesgevers", data=json.dumps({}), content_type="application/json")
        self.assertEqual(HTTPStatus.BAD_REQUEST, response.status_code)
        self.assertIn("error", json.loads(response.data))

    def test_create_lesgever_success(self):
        lesgever_data = {
            "naam": "Bart De Bruyn"
        }
        response = self.app.post("/lesgevers", data=json.dumps(lesgever_data), content_type="application/json")
        self.assertEqual(HTTPStatus.CREATED, response.status_code)


if __name__ == "__main__":
    unittest.main()
