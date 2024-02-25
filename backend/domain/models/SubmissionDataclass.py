from dataclasses import dataclass
from datetime import datetime

from domain.models.base_model import JsonRepresentable


@dataclass()
class SubmissionDataclass(JsonRepresentable):
    date_time: datetime
    group_id: int
    student_id: int
    state: int
    message: str
    id: int | None = None
