from collections.abc import Generator

from sqlmodel import Session

from db.extensions import engine


def get_session() -> Generator[Session, None, None]:
    with Session(engine, expire_on_commit=False) as session:
        yield session
