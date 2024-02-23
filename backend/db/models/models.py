from backend.db.extentions import db
from backend.domain.models.models import Subject, Teacher
from sqlalchemy.orm import Mapped, mapped_column, relationship


class TeacherModel(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    subjects: Mapped[list["SubjectModel"]] = relationship("SubjectModel", back_populates="teacher")

    def to_domain_model(self) -> Teacher:
        return Teacher(
            id=self.id,
            name=self.name
        )


class SubjectModel(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    teacher_id: Mapped[int] = mapped_column(db.ForeignKey("teacher_model.id"))
    teacher: Mapped["TeacherModel"] = relationship("TeacherModel", back_populates="subjects")

    def to_domain_model(self):
        return Subject(
            id=self.id,
            name=self.name,
            teacher_id=self.teacher_id
        )
