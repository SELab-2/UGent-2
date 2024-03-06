from db.implementation.SqlDAOProvider import SqlDAOProvider
from db.interface.DAOProvider import DAOProvider


def get_dao_provider() -> DAOProvider:
    return SqlDAOProvider()
