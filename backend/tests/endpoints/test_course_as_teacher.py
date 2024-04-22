import unittest

from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_json_length, assert_status_code, login_as, make_authenticated_request

# Define constants for URLs
GET_COURSES_URL = "/api/teacher/courses"
GET_TEACHERS_URL = "/api/courses/1/teachers"
ADD_TEACHER_URL = "/api/teacher/courses/1/add"
GET_PROJECTS_URL = "/api/teacher/projects"
CREATE_COURSE_URL = "/api/teacher/courses"
LEAVE_COURSE_URL = "/api/teacher/courses/1/leave"


class TestCourseAsTeacher(unittest.TestCase):
    TESTED_USER_ID = 9

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        login_as(self.client, self.TESTED_USER_ID)

    def tearDown(self) -> None:
        pass

    def test_courses(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_COURSES_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 1)

    def test_get_teacher_of_course(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_TEACHERS_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 2)

    def test_add_teacher_to_course(self) -> None:
        response = make_authenticated_request(
            self.client, self.TESTED_USER_ID, "post", ADD_TEACHER_URL, params={"teacher_id": 10},
        )
        assert_status_code(response, status.HTTP_200_OK)

    def test_projects(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_PROJECTS_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 2)

    def test_create_course(self) -> None:
        response = make_authenticated_request(
            self.client,
            self.TESTED_USER_ID,
            "post",
            CREATE_COURSE_URL,
            json={"name": "New Course", "archived": False},
        )
        assert_status_code(response, status.HTTP_200_OK)

        # test if the new course is in the list
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_COURSES_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 2)

    def test_leave_course(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", LEAVE_COURSE_URL)
        assert_status_code(response, status.HTTP_200_OK)

        # test if the course is no longer in the list
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", GET_COURSES_URL)
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 0)

    def test_add_teacher_to_course_as_student(self) -> None:
        response = make_authenticated_request(self.client, 1, "post", ADD_TEACHER_URL, params={"teacher_id": 10})
        assert_status_code(response, status.HTTP_403_FORBIDDEN)

    # try adding a user that is not a teacher to the course
    def test_add_student_to_course(self) -> None:
        response = make_authenticated_request(
            self.client, self.TESTED_USER_ID, "post", ADD_TEACHER_URL, params={"teacher_id": 1},
        )
        assert_status_code(response, status.HTTP_400_BAD_REQUEST)


if __name__ == "__main__":
    unittest.main()
