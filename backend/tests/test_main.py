import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DB_TEST_URI = f"postgresql://{os.getenv("TEST_DB_USER", "postgres")}:postgres@localhost:5432/delphi-test"
test_engine = create_engine(DB_TEST_URI)
SessionLocal = sessionmaker(autocommit=False, bind=test_engine)
