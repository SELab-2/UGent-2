from collections.abc import Generator

from sqlalchemy.orm import Session, sessionmaker

from db.extensions import engine

# Generator for db sessions. Check the [documentation.md] for the use of sessions.
SessionLocal: sessionmaker[Session] = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session() -> Generator[Session, None, None]:
    """
    Returns a generator for session objects.
    To be used as dependency injection.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
