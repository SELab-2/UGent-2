import os

from sqlmodel import create_engine

"""
Retrieve the variables needed for a connection to the database.
We use environment variables for the code to be more adaptable across different environments.
The second variable in os.getenv specifies the default value.
"""

db_host = os.getenv("DB_HOST", "localhost")         # where the database is hosted
db_port = os.getenv("DB_PORT", "5432")              # port number on which the database server is listening
db_user = os.getenv("DB_USERNAME", "postgres")      # username for the database
db_password = os.getenv("DB_PASSWORD", "postgres")  # password for the user
db_database = os.getenv("DB_DATABASE", "delphi")    # name of the database

# dialect+driver://username:password@host:port/database
DB_URI = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_database}"

# The engine manages database-operations.
# There is only one instance of the engine, specified here.
engine = create_engine(DB_URI)
