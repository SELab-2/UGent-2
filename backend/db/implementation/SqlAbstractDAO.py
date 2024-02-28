from abc import ABC
from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from db.errors.database_errors import ItemNotFoundError
from db.extensions import engine
from db.models.models import AbstractModel

T = TypeVar("T", bound=AbstractModel)
D = TypeVar("D")


class SqlAbstractDAO(Generic[T, D], ABC):

    @staticmethod
    def get_object(ident: int) -> D:
        with Session(engine) as session:
            generic_object: T | None = session.get(T, ident)

            if not generic_object:
                msg = f"object with id {ident} not found"
                raise ItemNotFoundError(msg)

            return generic_object.to_domain_model()

    @staticmethod
    def get_all() -> list[D]:
        with Session(engine) as session:
            generic_objects: list[T] = list(session.scalars(select(T)).all())
            return [generic_object.to_domain_model() for generic_object in generic_objects]


