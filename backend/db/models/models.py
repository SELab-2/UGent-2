from abc import abstractmethod
from dataclasses import dataclass  # automatically add special methods as __init__() and __repr__()
from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.extensions import Base
from domain.models.AdminDataclass import AdminDataclass
from domain.models.GroupDataclass import GroupDataclass
from domain.models.ProjectDataclass import ProjectDataclass
from domain.models.StudentDataclass import StudentDataclass
from domain.models.SubjectDataclass import SubjectDataclass
from domain.models.SubmissionDataclass import SubmissionDataclass, SubmissionState
from domain.models.TeacherDataclass import TeacherDataclass
from domain.models.UserDataclass import UserDataclass

# Create a generic type variable bound to subclasses of BaseModel.
D = TypeVar("D", bound=BaseModel)


@dataclass()
class AbstractModel(Generic[D]):
    """
    This class is meant to be inherited by the python classes for the database tables.
    It makes sure that every child implements the to_domain_model function
    and receives Pydantic data validation.
    """
    @abstractmethod
    def to_domain_model(self) -> D:
        """
        Change to an actual easy-to-use dataclass defined in [domain/models/*].
        This prevents working with instances of SQLAlchemy's Base class.
        """

# See the EER diagram for a more visual representation.

@dataclass()
class User(Base, AbstractModel):
    __tablename__ = "users"
    name: Mapped[str]
    email: Mapped[str]
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    def to_domain_model(self) -> UserDataclass:
        return UserDataclass(id=self.id, name=self.name, email=self.email)


@dataclass()
class Admin(Base, AbstractModel):
    __tablename__ = "admins"
    id: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)
    user: Mapped[User] = relationship()

    def to_domain_model(self) -> AdminDataclass:
        return AdminDataclass(id=self.id, name=self.user.name, email=self.user.email)


teachers_subjects = Table(
    "teachers_subjects",
    Base.metadata,
    Column("teacher_id", ForeignKey("teachers.id"), primary_key=True),
    Column("subject_id", ForeignKey("subjects.id"), primary_key=True),
)
students_subjects = Table(
    "students_subjects",
    Base.metadata,
    Column("student_id", ForeignKey("students.id"), primary_key=True),
    Column("subject_id", ForeignKey("subjects.id"), primary_key=True),
)
students_groups = Table(
    "students_groups",
    Base.metadata,
    Column("student_id", ForeignKey("students.id"), primary_key=True),
    Column("group_id", ForeignKey("groups.id"), primary_key=True),
)


@dataclass()
class Teacher(Base, AbstractModel):
    __tablename__ = "teachers"
    id: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)
    user: Mapped[User] = relationship()
    subjects: Mapped[list["Subject"]] = relationship(secondary=teachers_subjects, back_populates="teachers")

    def to_domain_model(self) -> TeacherDataclass:
        return TeacherDataclass(id=self.id, name=self.user.name, email=self.user.email)


@dataclass()
class Student(Base, AbstractModel):
    __tablename__ = "students"
    id: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)
    user: Mapped[User] = relationship()
    subjects: Mapped[list["Subject"]] = relationship(secondary=students_subjects, back_populates="students")
    groups: Mapped[list["Group"]] = relationship(secondary=students_groups, back_populates="students")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="student")

    def to_domain_model(self) -> StudentDataclass:
        return StudentDataclass(id=self.id, name=self.user.name, email=self.user.email)


@dataclass()
class Subject(Base, AbstractModel):
    __tablename__ = "subjects"
    name: Mapped[str]
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    teachers: Mapped[list[Teacher]] = relationship(secondary=teachers_subjects, back_populates="subjects")
    students: Mapped[list[Student]] = relationship(secondary=students_subjects, back_populates="subjects")
    projects: Mapped[list["Project"]] = relationship(back_populates="subject")

    def to_domain_model(self) -> SubjectDataclass:
        return SubjectDataclass(id=self.id, name=self.name)


@dataclass()
class Project(Base, AbstractModel):
    __tablename__ = "projects"
    name: Mapped[str]
    deadline: Mapped[datetime]
    archived: Mapped[bool]
    description: Mapped[str]
    requirements: Mapped[str]
    visible: Mapped[bool]
    max_students: Mapped[int]
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey(Subject.id))
    subject: Mapped[Subject] = relationship(back_populates="projects")
    groups: Mapped[list["Group"]] = relationship(back_populates="project")

    def to_domain_model(self) -> ProjectDataclass:
        return ProjectDataclass(
            id=self.id,
            name=self.name,
            deadline=self.deadline,
            archived=self.archived,
            description=self.description,
            requirements=self.requirements,
            visible=self.visible,
            max_students=self.max_students,
            subject_id=self.subject_id,
        )


@dataclass()
class Group(Base, AbstractModel):
    __tablename__ = "groups"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(ForeignKey(Project.id))
    project: Mapped[Project] = relationship(back_populates="groups")
    students: Mapped[list[Student]] = relationship(secondary=students_groups, back_populates="groups")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="group")

    def to_domain_model(self) -> GroupDataclass:
        return GroupDataclass(id=self.id, project_id=self.project_id)


@dataclass()
class Submission(Base, AbstractModel):
    __tablename__ = "submissions"
    date_time: Mapped[datetime]
    state: Mapped[SubmissionState]
    message: Mapped[str]
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    group_id: Mapped[int] = mapped_column(ForeignKey(Group.id))
    group: Mapped[Group] = relationship(back_populates="submissions")
    student_id: Mapped[int] = mapped_column(ForeignKey(Student.id))
    student: Mapped[Student] = relationship(back_populates="submissions")

    def to_domain_model(self) -> SubmissionDataclass:
        return SubmissionDataclass(
            id=self.id,
            date_time=self.date_time,
            group_id=self.group_id,
            student_id=self.student_id,
            state=self.state,
            message=self.message,
        )
