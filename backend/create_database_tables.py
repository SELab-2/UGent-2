from sqlalchemy import Engine
from sqlalchemy_utils import create_database, database_exists
from sqlmodel import Session, SQLModel

from db.extensions import engine


def initialize_tables(session_instance: Session, engine_instance: Engine) -> None:
    if not database_exists(engine_instance.url):
        create_database(engine_instance.url)
    SQLModel.metadata.drop_all(engine_instance)
    SQLModel.metadata.create_all(engine_instance)
    session_instance.commit()


if __name__ == "__main__":
    with Session(engine) as session:
        initialize_tables(session, engine)
        session.close()
