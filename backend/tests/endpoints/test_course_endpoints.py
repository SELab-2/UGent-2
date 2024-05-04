import unittest

from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_status_code, login_as, make_authenticated_request

# Define constants for URLs
GET_COURSE_URL = "/api/courses/1"
GET_COURSE_PROJECTS_URL = "/api/courses/1/projects"
GET_COURSE_TEACHERS_URL = "/api/courses/1/teachers"
GET_COURSE_STUDENTS_URL = "/api/courses/1/students"
CREATE_PROJECT_IN_COURSE_URL = "/api/courses/1/projects"
UPDATE_COURSE_URL = "/api/courses/1"


class TestCourseEndpoints(unittest.TestCase):
    TESTED_USER_ID = 1  # Assuming the user ID is 1

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        login_as(self.client, self.TESTED_USER_ID)

    def tearDown(self) -> None:
        pass

    def test_get_course(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_COURSE_URL)
        assert_status_code(response, status.HTTP_200_OK)

    def test_get_course_projects(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_COURSE_PROJECTS_URL)
        assert_status_code(response, status.HTTP_200_OK)

    def test_get_course_teachers(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_COURSE_TEACHERS_URL)
        assert_status_code(response, status.HTTP_200_OK)

    def test_get_course_students(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_COURSE_STUDENTS_URL)
        assert_status_code(response, status.HTTP_200_OK)

    def test_create_project_in_course(self) -> None:
        project_data = {
            "name": "New Project",
            "deadline": "2024-12-31T23:59:59",
            "archived": False,
            "description": "Project description",
            "requirements": '{"type":"SUBMISSION","root_constraint":{"type":"FILE","file_name":"submission.txt"},'
                            '"global_constraints":[]}',
            "visible": True,
            "max_students": 5,
        }
        response = make_authenticated_request(self.client, 9, "post", CREATE_PROJECT_IN_COURSE_URL, json=project_data)
        assert_status_code(response, status.HTTP_200_OK)

    def test_update_course(self) -> None:
        course_data = {
            "name": "Updated Course",
            "archived": False,
        }
        response = make_authenticated_request(self.client, 9, "put", UPDATE_COURSE_URL, json=course_data)
        assert_status_code(response, status.HTTP_200_OK)


if __name__ == "__main__":
    unittest.main()
