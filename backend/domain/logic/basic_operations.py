from typing import TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from db.errors.database_errors import ItemNotFoundError
from db.models.models import AbstractModel

# Create a generic type variable bound to subclasses of AbstractModel.
T = TypeVar("T", bound=AbstractModel)


def get(session: Session, object_type: type[T], ident: int) -> T:
    """
    General function for retrieving a single object from the database.
    The type of the object and its id as well a session object has to be provided. 
    """
    generic_object: T | None = session.get(object_type, ident)

    if not generic_object:
        msg = f"object with id {ident} not found"
        raise ItemNotFoundError(msg)

    return generic_object


def get_all(session: Session, object_type: type[T]) -> list[T]:
    """
    General function for retrieving all objects of a certain type from the database.
    """
    return list(session.scalars(select(object_type)).all())
