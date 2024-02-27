from dataclasses import dataclass

from domain.models.UserDataclass import UserDataclass, UserDataClassRequest


@dataclass()
class TeacherDataclass(UserDataclass):
    pass


@dataclass()
class TeacherDataClassRequest(UserDataClassRequest):
    pass
