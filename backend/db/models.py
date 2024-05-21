import enum
from datetime import datetime

from pydantic import computed_field, model_serializer
from sqlmodel import Field, Relationship, SQLModel

from domain.logic.role_enum import Role


class TeacherCourse(SQLModel, table=True):
    teacher_id: int = Field(foreign_key="teacher.id", primary_key=True)
    course_id: int = Field(foreign_key="course.id", primary_key=True)


class StudentCourse(SQLModel, table=True):
    student_id: int = Field(foreign_key="student.id", primary_key=True)
    course_id: int = Field(foreign_key="course.id", primary_key=True)


class StudentGroup(SQLModel, table=True):
    student_id: int = Field(foreign_key="student.id", primary_key=True)
    group_id: int = Field(foreign_key="group.id", primary_key=True)


class User(SQLModel, table=True):
    name: str
    email: str
    language: str = "en"
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

    @model_serializer
    def serialize(self) -> User:
        return self.user


class Teacher(SQLModel, table=True):
    id: int = Field(default=None, foreign_key="user.id", primary_key=True)
    user: User = Relationship(back_populates="teacher")
    courses: list["Course"] = Relationship(link_model=TeacherCourse, back_populates="teachers")

    @model_serializer
    def serialize(self) -> User:
        return self.user


class Student(SQLModel, table=True):
    id: int = Field(default=None, foreign_key="user.id", primary_key=True)
    user: User = Relationship(back_populates="student")
    courses: list["Course"] = Relationship(link_model=StudentCourse, back_populates="students")
    groups: list["Group"] = Relationship(link_model=StudentGroup, back_populates="students")
    submissions: list["Submission"] = Relationship(back_populates="student")

    @model_serializer
    def serialize(self) -> User:
        return self.user


class CourseInput(SQLModel):
    name: str
    archived: bool


class Course(CourseInput, table=True):  # Inherits from CourseInput
    id: int = Field(default=None, primary_key=True)
    teachers: list[Teacher] = Relationship(link_model=TeacherCourse, back_populates="courses")
    students: list[Student] = Relationship(link_model=StudentCourse, back_populates="courses")
    projects: list["Project"] = Relationship(back_populates="course")


class ProjectInput(SQLModel):
    name: str
    deadline: datetime
    archived: bool
    description: str
    requirements: str
    visible: bool
    max_students: int
    dockerfile: str


class Project(ProjectInput, table=True):  # Inherits from ProjectInput
    id: int = Field(default=None, primary_key=True)
    course_id: int = Field(default=None, foreign_key="course.id")
    course: Course = Relationship(back_populates="projects")
    groups: list["Group"] = Relationship(back_populates="project")
    image_id: str


class Group(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    visible_id: int
    project_id: int = Field(default=None, foreign_key="project.id")
    project: Project = Relationship(back_populates="groups")
    students: list[Student] = Relationship(link_model=StudentGroup, back_populates="groups")
    submissions: list["Submission"] = Relationship(back_populates="group")

    @computed_field
    @property
    def member_count(self) -> int:
        return len(self.students)


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


class Config(SQLModel, table=True):
    key: str = Field(primary_key=True)
    value: str


class ProjectStatistics(SQLModel):
    submissions: int = Field(description="Total number of groups with a submission")
    approved: int = Field(description="Number of groups with the latest submission approved")
    rejected: int = Field(description="Number of groups with the latest submission rejected")
    pending: int = Field(description="Number of groups with the latest submission pending")
    no_submission: int = Field(description="Number of groups with no submission")
