import unittest

from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_json_length, assert_status_code, login_as, make_authenticated_request

# Define constants for URLs
GET_SUBJECTS_URL = "/api/student/subjects"
JOIN_SUBJECT_URL = "/api/student/subjects/1/join"
LEAVE_SUBJECT_URL = "/api/student/subjects/1/leave"
GET_PROJECTS_URL = "/api/student/projects"


class TestSubjectAsStudent(unittest.TestCase):
    TESTED_USER_ID = 1

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        login_as(self.client, self.TESTED_USER_ID)

    def tearDown(self) -> None:
        pass

    def test_subjects(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_SUBJECTS_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 3)

    def test_join_subject_already_enrolled(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", JOIN_SUBJECT_URL)
        assert_status_code(response, status.HTTP_400_BAD_REQUEST)

    def test_leave_and_join_subject(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", LEAVE_SUBJECT_URL)
        assert_status_code(response, status.HTTP_200_OK)

        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_SUBJECTS_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 2)

        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", JOIN_SUBJECT_URL)
        assert_status_code(response, status.HTTP_200_OK)

        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_SUBJECTS_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 3)

    def test_projects(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_PROJECTS_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 4)


if __name__ == "__main__":
    unittest.main()
