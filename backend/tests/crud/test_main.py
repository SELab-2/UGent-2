import os
from collections.abc import Generator

from sqlmodel import Session, create_engine

# Construct the database connection string using environment variables
DB_TEST_URI = f"postgresql://{os.getenv('TEST_DB_USER', 'postgres')}:postgres@localhost:5432/delphi-test"

# Create an engine using SQLModel's create_engine
test_engine = create_engine(DB_TEST_URI)


# Function to get a new database session
def get_db() -> Generator[Session, None, None]:
    with Session(test_engine) as session:
        yield session
