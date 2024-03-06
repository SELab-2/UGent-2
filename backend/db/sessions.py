from collections.abc import Generator

from sqlalchemy.orm import Session, sessionmaker

from db.extensions import engine

SessionLocal: sessionmaker[Session] = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
