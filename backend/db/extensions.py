import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

"""
Retrieve the variables needed for a connection to the database.
We use environment variables for the code to be more adaptable across different environments.
The second variable in os.getenv specifies the default value.
"""
# where the database is hosted
db_host = os.getenv("DB_HOST", "localhost")
# port number on which the database server is listening
db_port = os.getenv("DB_PORT", "5432")
# username for the database
db_user = os.getenv("DB_USERNAME", "postgres")
# password for the user
db_password = os.getenv("DB_PASSWORD", "postgres")
# name of the database
db_database = os.getenv("DB_DATABASE", "delphi")

# dialect+driver://username:password@host:port/database
DB_URI = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_database}"

# The engine manages database-operations.
# There is only one instance of the engine, specified here.
engine = create_engine(DB_URI)


class Base(DeclarativeBase):
    """
    This class is meant to be inherited from to define the database tables, see [db/models/models.py].
    For usage, please check https://docs.sqlalchemy.org/en/20/orm/declarative_styles.html#using-a-declarative-base-class.
    """
