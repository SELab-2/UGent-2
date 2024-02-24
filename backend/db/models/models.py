from datetime import datetime

from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.extensions import db


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str]
    email: Mapped[str]


class Admin(db.Model):
    id: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)


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


class Student(db.Model):
    id: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)
    subjects: Mapped[list["Subject"]] = relationship(secondary=students_subjects, back_populates="students")
    groups: Mapped[list["Group"]] = relationship(secondary=students_groups, back_populates="students")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="student")


class Subject(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str]
    teachers: Mapped[list[Teacher]] = relationship(secondary=teachers_subjects, back_populates="subjects")
    students: Mapped[list[Student]] = relationship(secondary=students_subjects, back_populates="subjects")
    projects: Mapped[list["Project"]] = relationship(back_populates="subject")


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


class Group(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(ForeignKey(Project.id))
    project: Mapped[Project] = relationship(back_populates="groups")
    students: Mapped[list[Student]] = relationship(secondary=students_groups, back_populates="groups")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="group")


class Submission(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date_time: Mapped[datetime]
    group_id: Mapped[int] = mapped_column(ForeignKey(Group.id))
    group: Mapped[Group] = relationship(back_populates="submissions")
    student_id: Mapped[int] = mapped_column(ForeignKey(Student.id))
    student: Mapped[Student] = relationship(back_populates="submissions")
    state: Mapped[int]
    message: Mapped[str]
