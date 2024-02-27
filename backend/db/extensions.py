import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

db_host = os.getenv("DB_HOST", "localhost")
db_port = os.getenv("DB_PORT", "5432")
db_user = os.getenv("DB_USERNAME", "postgres")
db_password = os.getenv("DB_PASSWORD", "postgres")
db_database = os.getenv("DB_DATABASE", "delphi")

DB_URI = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_database}"
engine = create_engine(DB_URI)

DBSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
