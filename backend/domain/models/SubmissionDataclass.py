import enum
from dataclasses import dataclass
from datetime import datetime

from domain.models.base_model import JsonRepresentable


class SubmissionState(enum.Enum):
    Pending = 1
    Approved = 2
    Rejected = 3


@dataclass()
class SubmissionDataclass(JsonRepresentable):
    date_time: datetime
    group_id: int
    student_id: int
    state: SubmissionState
    message: str
    id: int | None = None
