
from db.extensions import DBSession


def get_session() -> DBSession:
    """
    Maakt een nieuwe database sessie aan.
    :return: De nieuwe sessie.
    """
    session = DBSession()
    # Use "yield" and "finally" to close the session when it's no longer needed
    try:
        yield session
    finally:
        session.close()
