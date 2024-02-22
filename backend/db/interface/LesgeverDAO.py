from abc import ABC, abstractmethod
from backend.domain.models.models import Lesgever


class LesgeverDAO(ABC):

    @abstractmethod
    def getLesgever(self, ident: int) -> Lesgever:
        """
        Haalt een lesgever op aan de hand van zijn identificatie.

        :param ident: Het id van de te zoeken lesgever.
        :return: De lesgever die overeenkomt met de gegeven id.
        :raises ItemNotFoundException: Als geen lesgever met het gegeven id gevonden werd.
        """
        raise NotImplementedError()

    @abstractmethod
    def getAllLesgevers(self) -> list[Lesgever]:
        """
        Haalt alle lesgevers op.

        :return: Een lijst van alle lesgevers.
        """
        raise NotImplementedError()

    @abstractmethod
    def createLesgever(self, lesgever: Lesgever):
        """
        Maakt een nieuwe lesgever aan.

        :param lesgever: De lesgever die aangemaakt moet worden.
        """
        raise NotImplementedError()
