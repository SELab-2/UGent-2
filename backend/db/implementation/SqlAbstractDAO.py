from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from pydantic import BaseModel

from db.errors.database_errors import ItemNotFoundError
from db.extensions import engine
from db.models.models import AbstractModel


T = TypeVar("T", bound=AbstractModel)
D = TypeVar("D", bound=BaseModel)


class SqlAbstractDAO(Generic[T, D]):
    def __init__(self) -> None:
        self.model_class: type[T]

    def get(self, ident: int) -> D:
        with Session(engine) as session:
            generic_object: T | None = session.get(self.model_class, ident)

            if not generic_object:
                msg = f"object with id {ident} not found"
                raise ItemNotFoundError(msg)

            return generic_object.to_domain_model()

    def get_all(self) -> list[D]:
        with Session(engine) as session:
            generic_objects: list[T] = list(session.scalars(select(self.model_class)).all())
            return [generic_object.to_domain_model() for generic_object in generic_objects]
