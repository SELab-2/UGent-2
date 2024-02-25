import dataclasses
from abc import ABC
from dataclasses import dataclass
from datetime import datetime


@dataclass()
class JsonRepresentable(ABC):
    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


@dataclass()
class UserDataclass(JsonRepresentable):
    name: str
    email: str
    id: int | None = None


@dataclass()
class AdminDataclass(JsonRepresentable):
    id: int


@dataclass()
class TeacherDataclass(JsonRepresentable):
    id: int
    subject_ids: list[int] | None = None


@dataclass()
class StudentDataclass(JsonRepresentable):
    id: int
    subject_ids: list[int] | None = None
    group_ids: list[int] | None = None
    submission_ids: list[int] | None = None


@dataclass()
class SubjectDataclass(JsonRepresentable):
    name: str
    id: int | None = None
    teacher_ids: list[int] | None = None
    student_ids: list[int] | None = None
    project_ids: list[int] | None = None


@dataclass()
class ProjectDataclass(JsonRepresentable):
    name: str
    deadline: datetime
    archived: bool
    requirements: str
    visible: bool
    max_students: int
    subject_id: int
    id: int | None = None
    group_ids: list[int] | None = None


@dataclass()
class GroupDataclass(JsonRepresentable):
    project_id: int
    id: int | None = None
    student_ids: list[int] | None = None
    submission_ids: list[int] | None = None


@dataclass()
class SubmissionDataclass(JsonRepresentable):
    date_time: datetime
    group_id: int
    student_id: int
    state: int
    message: str
    id: int | None = None
