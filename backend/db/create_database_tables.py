from sqlalchemy import Engine, MetaData, Table, inspect
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy_utils import create_database, database_exists

import db.models.models
from db.extensions import Base, engine


def initialize_tables(session_instance: Session, engine_instance: Engine) -> None:
    if not database_exists(engine_instance.url):
        create_database(engine_instance.url)
    Base.metadata.drop_all(engine_instance)
    Base.metadata.create_all(engine_instance)
    session_instance.commit()


if __name__ == "__main__":
    session = sessionmaker(autocommit=False, bind=engine)()
    initialize_tables(session, engine)
    session.close()
