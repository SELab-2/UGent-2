from typing import TypeVar, Type

from sqlalchemy import select
from sqlalchemy.orm import Session

from db.errors.database_errors import ItemNotFoundError
from db.models.models import AbstractModel

T = TypeVar("T", bound=AbstractModel)


def get(session: Session, object_type: Type, ident: int) -> T:
    generic_object: T | None = session.get(object_type, ident)

    if not generic_object:
        msg = f"object with id {ident} not found"
        raise ItemNotFoundError(msg)

    return generic_object.to_domain_model()


def get_all(session: Session) -> list[T]:
    return list(session.scalars(select(T)).all())
