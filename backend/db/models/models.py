from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.db.extentions import db
from backend.domain.models.models import Lesgever, Vak


class LesgeverModel(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    naam: Mapped[str] = mapped_column()
    vakken: Mapped[list["VakModel"]] = relationship("VakModel", back_populates="lesgever")

    def to_domain_model(self) -> Lesgever:
        return Lesgever(
            id=self.id,
            naam=self.naam
        )


class VakModel(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    naam: Mapped[str] = mapped_column()
    lesgever_id: Mapped[int] = mapped_column(db.ForeignKey('lesgever_model.id'))
    lesgever: Mapped["LesgeverModel"] = relationship("LesgeverModel", back_populates="vakken")

    def to_domain_model(self):
        return Vak(
            id=self.id,
            naam=self.naam,
            lesgever_id=self.lesgever_id
        )
