from abc import abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from domain.models.AdminDataclass import AdminDataclass
from domain.models.GroupDataclass import GroupDataclass
from domain.models.ProjectDataclass import ProjectDataclass
from domain.models.StudentDataclass import StudentDataclass
from domain.models.SubjectDataclass import SubjectDataclass
from domain.models.SubmissionDataclass import SubmissionDataclass, SubmissionState
from domain.models.TeacherDataclass import TeacherDataclass
from domain.models.UserDataclass import UserDataclass


@dataclass()
class AbstractModel:
    @abstractmethod
    def to_domain_model(self) -> Any:
        pass


@dataclass()
class User(DeclarativeBase, AbstractModel):
    name: Mapped[str]
    email: Mapped[str]
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    def to_domain_model(self) -> UserDataclass:
        return UserDataclass(id=self.id, name=self.name, email=self.email)


@dataclass()
class Admin(User):
    id: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)

    def to_domain_model(self) -> AdminDataclass:
        return AdminDataclass(id=self.id, name=self.name, email=self.email)


teachers_subjects = Table(
    "teachers_subjects",
    DeclarativeBase.metadata,
    Column("teacher_id", ForeignKey("teacher.id"), primary_key=True),
    Column("subject_id", ForeignKey("subject.id"), primary_key=True),
)
students_subjects = Table(
    "students_subjects",
    DeclarativeBase.metadata,
    Column("student_id", ForeignKey("student.id"), primary_key=True),
    Column("subject_id", ForeignKey("subject.id"), primary_key=True),
)
students_groups = Table(
    "students_groups",
    DeclarativeBase.metadata,
    Column("student_id", ForeignKey("student.id"), primary_key=True),
    Column("group_id", ForeignKey("group.id"), primary_key=True),
)


@dataclass()
class Teacher(User):
    id: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)
    subjects: Mapped[list["Subject"]] = relationship(secondary=teachers_subjects, back_populates="teachers")

    def to_domain_model(self) -> TeacherDataclass:
        return TeacherDataclass(id=self.id, name=self.name, email=self.email)


@dataclass()
class Student(User):
    id: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)
    subjects: Mapped[list["Subject"]] = relationship(secondary=students_subjects, back_populates="students")
    groups: Mapped[list["Group"]] = relationship(secondary=students_groups, back_populates="students")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="student")

    def to_domain_model(self) -> StudentDataclass:
        return StudentDataclass(id=self.id, name=self.name, email=self.email)


@dataclass()
class Subject(DeclarativeBase, AbstractModel):
    name: Mapped[str]
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    teachers: Mapped[list[Teacher]] = relationship(secondary=teachers_subjects, back_populates="subjects")
    students: Mapped[list[Student]] = relationship(secondary=students_subjects, back_populates="subjects")
    projects: Mapped[list["Project"]] = relationship(back_populates="subject")

    def to_domain_model(self) -> SubjectDataclass:
        return SubjectDataclass(id=self.id, name=self.name)


@dataclass()
class Project(DeclarativeBase, AbstractModel):
    name: Mapped[str]
    deadline: Mapped[datetime]
    archived: Mapped[bool]
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
            requirements=self.requirements,
            visible=self.visible,
            max_students=self.max_students,
            subject_id=self.subject_id,
        )


@dataclass()
class Group(DeclarativeBase, AbstractModel):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(ForeignKey(Project.id))
    project: Mapped[Project] = relationship(back_populates="groups")
    students: Mapped[list[Student]] = relationship(secondary=students_groups, back_populates="groups")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="group")

    def to_domain_model(self) -> GroupDataclass:
        return GroupDataclass(id=self.id, project_id=self.project_id)


@dataclass()
class Submission(DeclarativeBase, AbstractModel):
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
