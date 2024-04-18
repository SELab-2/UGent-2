import unittest

from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_json_length, assert_status_code, login_as, make_authenticated_request


class TestSubjectAsTeacher(unittest.TestCase):
    TESTED_USER_ID = 9

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        self.token = None

    def tearDown(self) -> None:
        pass

    def test_fake_login(self) -> None:
        login_as(self.client, self.TESTED_USER_ID)

    def test_subjects(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/teacher/subjects")
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 1)

    def test_get_teacher_of_subject(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/subjects/1/teachers")
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 2)

    def test_add_teacher_to_subject(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", "/api/teacher/subjects/1/add",
                                                   params={"teacher_id": 10})
        assert_status_code(response, status.HTTP_200_OK)

    def test_projects(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/teacher/projects")
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 2)

    def test_create_subject(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", "/api/teacher/subjects",
                                                   json={"name": "New Subject", "archived": False})
        assert_status_code(response, status.HTTP_200_OK)

        # test if the new subject is in the list
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/teacher/subjects")
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 2)

    def test_leave_subject(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", "/api/teacher/subjects/1/leave")
        assert_status_code(response, status.HTTP_200_OK)

        # test if the subject is no longer in the list
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", "/api/teacher/subjects")
        assert_status_code(response, status.HTTP_200_OK)
        assert_json_length(response, 0)

    def test_add_teacher_to_subject_as_student(self) -> None:
        response = make_authenticated_request(self.client, 1, "post", "/api/teacher/subjects/1/add",
                                                   params={"teacher_id": 10})
        assert_status_code(response, status.HTTP_403_FORBIDDEN)

    # try adding a user that is not a teacher to the subject
    def test_add_student_to_subject(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "post", "/api/teacher/subjects/1/add",
                                                   params={"teacher_id": 1})
        assert_status_code(response, status.HTTP_400_BAD_REQUEST)


if __name__ == "__main__":
    unittest.main()
