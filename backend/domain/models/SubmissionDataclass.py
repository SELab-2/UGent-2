import enum
from dataclasses import dataclass
from datetime import datetime

from pydantic import BaseModel


class SubmissionState(enum.Enum):
    Pending = 1
    Approved = 2
    Rejected = 3


@dataclass()
class SubmissionDataclass(BaseModel):
    id: int
    date_time: datetime
    group_id: int
    student_id: int
    state: SubmissionState
    message: str
