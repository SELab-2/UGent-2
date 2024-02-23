from backend.db.extensions import db
from backend.domain.models.models import SubjectDataclass, TeacherDataclass
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Teacher(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    subjects: Mapped[list["Subject"]] = relationship("Subject", back_populates="teacher")

    def to_domain_model(self) -> TeacherDataclass:
        return TeacherDataclass(
            id=self.id,
            name=self.name
        )


class Subject(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    teacher_id: Mapped[int] = mapped_column(db.ForeignKey("teacher.id"))
    teacher: Mapped["Teacher"] = relationship("Teacher", back_populates="subjects")

    def to_domain_model(self):
        return SubjectDataclass(
            id=self.id,
            name=self.name,
            teacher_id=self.teacher_id
        )
