import enum
from datetime import datetime

from pydantic import computed_field
from sqlmodel import Field, Relationship, SQLModel

from domain.logic.role_enum import Role


class TeacherSubject(SQLModel, table=True):
    teacher_id: int = Field(foreign_key="teacher.id", primary_key=True)
    subject_id: int = Field(foreign_key="subject.id", primary_key=True)


class StudentSubject(SQLModel, table=True):
    student_id: int = Field(foreign_key="student.id", primary_key=True)
    subject_id: int = Field(foreign_key="subject.id", primary_key=True)


class StudentGroup(SQLModel, table=True):
    student_id: int = Field(foreign_key="student.id", primary_key=True)
    group_id: int = Field(foreign_key="group.id", primary_key=True)


class User(SQLModel, table=True):
    name: str
    email: str
    language: str = "EN"
    id: int = Field(default=None, primary_key=True)

    admin: "Admin" = Relationship(back_populates="user")
    teacher: "Teacher" = Relationship(back_populates="user")
    student: "Student" = Relationship(back_populates="user")

    @computed_field
    @property
    def roles(self) -> list[Role]:
        roles = []
        if self.admin:
            roles.append(Role.ADMIN)
        if self.teacher:
            roles.append(Role.TEACHER)
        if self.student:
            roles.append(Role.STUDENT)
        return roles


class Admin(SQLModel, table=True):
    id: int = Field(default=None, foreign_key="user.id", primary_key=True)
    user: User = Relationship(back_populates="admin")


class Teacher(SQLModel, table=True):
    id: int = Field(default=None, foreign_key="user.id", primary_key=True)
    user: User = Relationship(back_populates="teacher")
    subjects: list["Subject"] = Relationship(link_model=TeacherSubject, back_populates="teachers")


class Student(SQLModel, table=True):
    id: int = Field(default=None, foreign_key="user.id", primary_key=True)
    user: User = Relationship(back_populates="student")
    subjects: list["Subject"] = Relationship(link_model=StudentSubject, back_populates="students")
    groups: list["Group"] = Relationship(link_model=StudentGroup, back_populates="students")
    submissions: list["Submission"] = Relationship(back_populates="student")


class SubjectInput(SQLModel):
    name: str


class Subject(SubjectInput, table=True):  # Inherits from SubjectInput
    id: int = Field(default=None, primary_key=True)
    teachers: list[Teacher] = Relationship(link_model=TeacherSubject, back_populates="subjects")
    students: list[Student] = Relationship(link_model=StudentSubject, back_populates="subjects")
    projects: list["Project"] = Relationship(back_populates="subject")


class ProjectInput(SQLModel):
    name: str
    deadline: datetime
    archived: bool
    description: str
    requirements: str
    visible: bool
    max_students: int


class Project(ProjectInput, table=True):  # Inherits from ProjectInput
    id: int = Field(default=None, primary_key=True)
    subject_id: int = Field(default=None, foreign_key="subject.id")
    subject: Subject = Relationship(back_populates="projects")
    groups: list["Group"] = Relationship(back_populates="project")


class Group(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    project_id: int = Field(default=None, foreign_key="project.id")
    project: Project = Relationship(back_populates="groups")
    students: list[Student] = Relationship(link_model=StudentGroup, back_populates="groups")
    submissions: list["Submission"] = Relationship(back_populates="group")


class SubmissionState(enum.Enum):
    Pending = 1
    Approved = 2
    Rejected = 3


class Submission(SQLModel, table=True):
    date_time: datetime
    state: SubmissionState
    message: str
    filename: str
    id: int = Field(default=None, primary_key=True)
    group_id: int = Field(default=None, foreign_key="group.id")
    group: Group = Relationship(back_populates="submissions")
    student_id: int = Field(default=None, foreign_key="student.id")
    student: Student = Relationship(back_populates="submissions")