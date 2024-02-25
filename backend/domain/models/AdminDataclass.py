from dataclasses import dataclass

from domain.models.UserDataclass import UserDataclass


@dataclass()
class AdminDataclass(UserDataclass):
    pass
