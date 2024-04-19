import unittest

from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_json_length, assert_status_code, login_as, make_authenticated_request

# Define constants for URLs
GET_COURSES_URL = "/api/student/courses"
JOIN_COURSE_URL = "/api/student/courses/1/join"
LEAVE_COURSE_URL = "/api/student/courses/1/leave"
GET_PROJECTS_URL = "/api/student/projects"


class TestCourseAsStudent(unittest.TestCase):
    TESTED_USER_ID = 1

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        login_as(self.client, self.TESTED_USER_ID)

    def tearDown(self) -> None:
        pass

    def test_courses(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_COURSES_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 3)

    def test_join_course_already_enrolled(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", JOIN_COURSE_URL)
        assert_status_code(response, status.HTTP_400_BAD_REQUEST)

    def test_leave_and_join_course(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", LEAVE_COURSE_URL)
        assert_status_code(response, status.HTTP_200_OK)

        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_COURSES_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 2)

        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", JOIN_COURSE_URL)
        assert_status_code(response, status.HTTP_200_OK)

        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_COURSES_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 3)

    def test_projects(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_PROJECTS_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 4)


if __name__ == "__main__":
    unittest.main()
