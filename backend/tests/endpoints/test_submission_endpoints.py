import tempfile
import unittest
from pathlib import Path

from starlette import status
from starlette.testclient import TestClient

from app import app
from fill_database_mock import fill_database_mock
from tests.endpoints import assert_status_code, login_as, make_authenticated_request
from tests.test_simple_submissions import create_directory_and_zip

# Define constants for URLs
RETRIEVE_SUBMISSION_URL = "/api/groups/1/submission"
MAKE_SUBMISSION_URL = "/api/groups/1/submission"
DOWNLOAD_ALL_SUBMISSIONS_URL = "/api/projects/1/submissions"


class TestSubmissionEndpoints(unittest.TestCase):
    TESTED_USER_ID = 1
    TESTED_TEACHER_ID = 9

    def setUp(self) -> None:
        self.client = TestClient(app)
        fill_database_mock()
        login_as(self.client, self.TESTED_USER_ID)

    def tearDown(self) -> None:
        pass

    def test_retrieve_submission(self) -> None:
        response = make_authenticated_request(self.client, self.TESTED_USER_ID, "get", RETRIEVE_SUBMISSION_URL)
        assert_status_code(response, status.HTTP_200_OK)

    def test_make_submission(self) -> None:
        # Define constants for URLs
        # Define a temporary directory for the zip file
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_dir_path = Path(temp_dir)

            # Define the structure of the project to be zipped
            project_structure = {
                "src": {
                    "main.py": None,
                    "utils": {
                        "helper.py": None,
                    },
                },
                "tests": {"test_main.py": None},
                "README.md": None,
                ".gitignore": None,
            }

            # Create the directory structure and zip it
            create_directory_and_zip(project_structure, temp_dir_path, "submission")

            # Define the zip file to be submitted
            zip_file_path = temp_dir_path / "submission.zip"
            with zip_file_path.open("rb") as zip_file:
                mock_file = {"file": ("submission.zip", zip_file.read())}

                # Make an authenticated POST request to the submission endpoint
                response = make_authenticated_request(self.client, self.TESTED_USER_ID,
                                                      "post", MAKE_SUBMISSION_URL, files=mock_file)
                # Assert that the response status code is 200 (HTTP_200_OK)
                assert_status_code(response, status.HTTP_200_OK)

    def test_download_all_submissions(self) -> None:
        # Define constants for URLs

        # Make an authenticated GET request to the download all submissions endpoint
        response = make_authenticated_request(self.client, self.TESTED_TEACHER_ID, "get", DOWNLOAD_ALL_SUBMISSIONS_URL)

        # Assert that the response status code is 200 (HTTP_200_OK)
        assert_status_code(response, status.HTTP_200_OK)

        # Optionally, you can also check the content of the response to ensure it's a zip file
        assert response.headers["content-type"] == "application/zip"


if __name__ == "__main__":
    unittest.main()
