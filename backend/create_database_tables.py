import secrets

from sqlalchemy import Engine
from sqlalchemy_utils import create_database, database_exists
from sqlmodel import Session, SQLModel

import db.models
from db.extensions import engine


def initialize_tables(session_instance: Session, engine_instance: Engine) -> None:
    if not database_exists(engine_instance.url):
        create_database(engine_instance.url)
    SQLModel.metadata.drop_all(engine_instance)
    SQLModel.metadata.create_all(engine_instance)
    jwt_secret = db.models.Config(key="jwt_secret", value=secrets.token_urlsafe(64))
    session_instance.add(jwt_secret)
    session_instance.commit()


if __name__ == "__main__":
    with Session(engine) as session:
        initialize_tables(session, engine)
        session.close()
