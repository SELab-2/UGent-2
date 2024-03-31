from db.extensions import Base, engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import create_database, database_exists
from sqlalchemy import Table, MetaData, inspect

import db.models.models  # DO NOT REMOVE THIS LINE, create_all doesn't work without it


def initialize_tables(session_instance, engine_instance):
    if not database_exists(engine_instance.url):
        create_database(engine_instance.url)

    if inspect(engine_instance).has_table('users'):  # Check if the tables already exist and remove them
        # print("Dropping existing tables and making new ones...")
        metadata = MetaData()
        tables = ["submissions",
                  "students_groups",
                  "students_subjects",
                  "teachers_subjects",
                  "groups",
                  "projects",
                  "subjects",
                  "teachers",
                  "students",
                  "admins",
                  "users"]
        for name in tables:
            table = Table(name, metadata, autoload_with=engine_instance)
            table.drop(engine_instance)

    Base.metadata.create_all(engine_instance)
    session_instance.commit()


if __name__ == "__main__":
    session = sessionmaker(autocommit=False, bind=engine)()
    initialize_tables(session, engine)
    # print("Tables initialized")
    session.close()
