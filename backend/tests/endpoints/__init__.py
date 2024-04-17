from httpx import Response


def assert_status_code(response: Response, expected_status_code: int) -> None:
    assert response.status_code == expected_status_code, \
        f"Expected status code {expected_status_code}, but got {response.status_code}"


def assert_json_length(response: Response, expected_length: int) -> None:
    json_data = response.json()
    assert len(json_data) == expected_length, f"Expected JSON length {expected_length}, but got {len(json_data)}"
