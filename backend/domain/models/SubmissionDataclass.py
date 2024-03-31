import enum
from datetime import datetime

from pydantic import BaseModel


class SubmissionState(enum.Enum):
    Pending = 1
    Approved = 2
    Rejected = 3


class SubmissionDataclass(BaseModel):
    id: int
    date_time: datetime
    group_id: int
    student_id: int
    state: SubmissionState
    message: str
    filename: str
