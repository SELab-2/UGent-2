from abc import ABC, abstractmethod

from backend.domain.models.models import Vak


class VakDAO(ABC):

    @abstractmethod
    def create_vak(self, vak: Vak, lesgever_id: int):
        """
        Creëert een nieuw Vak in de database en associeert het met een Lesgever.

        :param vak: De Vak domeinmodel-instantie die aan de database moet worden toegevoegd.
        :param lesgever_id: De identificatie van de Lesgever waarmee het Vak geassocieerd wordt.
        :raises: ItemNotFoundException: Als er geen Lesgever met de opgegeven `lesgever_id` in de database bestaat.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_vak(self, lesgever_id: int):
        """
        Haalt een Vak op aan de hand van zijn identificatie.

        :param lesgever_id: De identificatie van het op te halen Vak.
        :raises ItemNotFoundException: Als er geen Vak met de opgegeven `ident` in de database bestaat.
        :returns: De domeinmodel-instantie van het opgehaalde Vak.
        """
        raise NotImplementedError()

    @abstractmethod
    def getVakken(self, lesgever_id: int) -> list[Vak]:
        """
        Haalt de vakken op die door een bepaalde lesgever worden gegeven.

        :param lesgever_id: De lesgever waarvan de vakken opgehaald moeten worden.
        :return: Een lijst van vakken die door de gegeven lesgever worden gegeven.
        """
        raise NotImplementedError()
