from datetime import datetime

from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.extensions import db
from domain.models.AdminDataclass import AdminDataclass
from domain.models.GroupDataclass import GroupDataclass
from domain.models.ProjectDataclass import ProjectDataclass
from domain.models.StudentDataclass import StudentDataclass
from domain.models.SubjectDataclass import SubjectDataclass
from domain.models.SubmissionDataclass import SubmissionDataclass
from domain.models.TeacherDataclass import TeacherDataclass
from domain.models.UserDataclass import UserDataclass


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str]
    email: Mapped[str]

    def to_domain_model(self) -> UserDataclass:
        return UserDataclass(id=self.id, name=self.name, email=self.email)


class Admin(db.Model):
    id: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)

    def to_domain_model(self) -> AdminDataclass:
        return AdminDataclass(id=self.id)


teachers_subjects = Table(
    "teachers_subjects",
    db.Model.metadata,
    Column("teacher_id", ForeignKey("teacher.id"), primary_key=True),
    Column("subject_id", ForeignKey("subject.id"), primary_key=True),
)
students_subjects = Table(
    "students_subjects",
    db.Model.metadata,
    Column("student_id", ForeignKey("student.id"), primary_key=True),
    Column("subject_id", ForeignKey("subject.id"), primary_key=True),
)
students_groups = Table(
    "students_groups",
    db.Model.metadata,
    Column("student_id", ForeignKey("student.id"), primary_key=True),
    Column("group_id", ForeignKey("group.id"), primary_key=True),
)


class Teacher(db.Model):
    id: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)
    subjects: Mapped[list["Subject"]] = relationship(secondary=teachers_subjects, back_populates="teachers")

    def to_domain_model(self) -> TeacherDataclass:
        return TeacherDataclass(id=self.id)


class Student(db.Model):
    id: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)
    subjects: Mapped[list["Subject"]] = relationship(secondary=students_subjects, back_populates="students")
    groups: Mapped[list["Group"]] = relationship(secondary=students_groups, back_populates="students")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="student")

    def to_domain_model(self) -> StudentDataclass:
        return StudentDataclass(id=self.id)


class Subject(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str]
    teachers: Mapped[list[Teacher]] = relationship(secondary=teachers_subjects, back_populates="subjects")
    students: Mapped[list[Student]] = relationship(secondary=students_subjects, back_populates="subjects")
    projects: Mapped[list["Project"]] = relationship(back_populates="subject")

    def to_domain_model(self) -> SubjectDataclass:
        return SubjectDataclass(id=self.id, name=self.name)


class Project(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str]
    deadline: Mapped[datetime]
    archived: Mapped[bool]
    requirements: Mapped[str]
    visible: Mapped[bool]
    max_students: Mapped[int]
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


class Group(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(ForeignKey(Project.id))
    project: Mapped[Project] = relationship(back_populates="groups")
    students: Mapped[list[Student]] = relationship(secondary=students_groups, back_populates="groups")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="group")

    def to_domain_model(self) -> GroupDataclass:
        return GroupDataclass(id=self.id, project_id=self.project_id)


class Submission(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date_time: Mapped[datetime]
    group_id: Mapped[int] = mapped_column(ForeignKey(Group.id))
    group: Mapped[Group] = relationship(back_populates="submissions")
    student_id: Mapped[int] = mapped_column(ForeignKey(Student.id))
    student: Mapped[Student] = relationship(back_populates="submissions")
    state: Mapped[int]
    message: Mapped[str]

    def to_domain_model(self) -> SubmissionDataclass:
        return SubmissionDataclass(
            id=self.id,
            date_time=self.date_time,
            group_id=self.group_id,
            student_id=self.student_id,
            state=self.state,
            message=self.message,
        )
