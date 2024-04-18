from collections.abc import Generator

from sqlmodel import Session

from db.extensions import engine

# Create an engine using SQLModel's create_engine
test_engine = engine


# Function to get a new database session
def get_db() -> Generator[Session, None, None]:
    with Session(test_engine) as session:
        yield session
