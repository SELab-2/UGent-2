from datetime import datetime

from sqlmodel import Field, Relationship, Session, SQLModel

from db.extensions import engine
from domain.models.SubmissionDataclass import SubmissionState


class User(SQLModel, table=True):
    name: str
    email: str
    language: str = "EN"
    id: int = Field(default=-1, primary_key=True)

    admin: "Admin" = Relationship(back_populates="user")
    teacher: "Teacher" = Relationship(back_populates="user")
    student: "Student" = Relationship(back_populates="user")


class Admin(SQLModel, table=True):
    id: int = Field(default=-1, foreign_key="user.id", primary_key=True)
    user: User = Relationship(back_populates="admin")


class TeacherSubject(SQLModel, table=True):
    teacher_id: int = Field(foreign_key="teacher.id", primary_key=True)
    subject_id: int = Field(foreign_key="subject.id", primary_key=True)


class StudentSubject(SQLModel, table=True):
    student_id: int = Field(foreign_key="student.id", primary_key=True)
    subject_id: int = Field(foreign_key="subject.id", primary_key=True)


class StudentGroup(SQLModel, table=True):
    student_id: int = Field(foreign_key="student.id", primary_key=True)
    group_id: int = Field(foreign_key="group.id", primary_key=True)


class Teacher(SQLModel, table=True):
    id: int = Field(default=-1, foreign_key="user.id", primary_key=True)
    user: User = Relationship(back_populates="teacher")
    subjects: list["Subject"] = Relationship(link_model=TeacherSubject, back_populates="teachers")


class Student(SQLModel, table=True):
    id: int = Field(default=-1, foreign_key="user.id", primary_key=True)
    user: User = Relationship(back_populates="student")
    subjects: list["Subject"] = Relationship(link_model=StudentSubject, back_populates="students")
    groups: list["Group"] = Relationship(link_model=StudentGroup, back_populates="students")
    submissions: list["Submission"] = Relationship(back_populates="student")


class Subject(SQLModel, table=True):
    name: str
    id: int = Field(default=-1, primary_key=True)
    teachers: list[Teacher] = Relationship(link_model=TeacherSubject, back_populates="subjects")
    students: list[Student] = Relationship(link_model=StudentSubject, back_populates="subjects")
    projects: list["Project"] = Relationship(back_populates="subject")


class Project(SQLModel, table=True):
    name: str
    deadline: datetime
    archived: bool
    description: str
    requirements: str
    visible: bool
    max_students: int
    id: int = Field(default=-1, primary_key=True)
    subject_id: int = Field(default=-1, foreign_key="subject.id")
    subject: Subject = Relationship(back_populates="projects")
    groups: list["Group"] = Relationship(back_populates="project")


class Group(SQLModel, table=True):
    id: int = Field(default=-1, primary_key=True)
    project_id: int = Field(default=-1, foreign_key="project.id")
    project: Project = Relationship(back_populates="groups")
    students: list[Student] = Relationship(link_model=StudentGroup, back_populates="groups")
    submissions: list["Submission"] = Relationship(back_populates="group")


class Submission(SQLModel, table=True):
    date_time: datetime
    state: SubmissionState
    message: str
    filename: str
    id: int = Field(default=-1, primary_key=True)
    group_id: int = Field(default=-1, foreign_key="group.id")
    group: Group = Relationship(back_populates="submissions")
    student_id: int = Field(default=-1, foreign_key="student.id")
    student: Student = Relationship(back_populates="submissions")


if __name__ == "__main__":
    # Initialize database engine; replace connection string as needed

    # Create tables
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

    # Insert mock data
    with Session(engine) as session:

        user1 = User(name="John Doe", email="john@example.com")
        user2 = User(name="Jane Doe", email="jane@example.com")

        teacher1 = Teacher(user=user1)
        student1 = Student(user=user2)

        subject1 = Subject(name="Math")
        subject2 = Subject(name="English")

        project1 = Project(
            name="Math Project",
            deadline=datetime.now(),
            archived=False,
            description="Math project description",
            requirements="Math project requirements",
            visible=True,
            max_students=2,
            subject=subject1,
        )
        project2 = Project(
            name="English Project",
            deadline=datetime.now(),
            archived=False,
            description="English project description",
            requirements="English project requirements",
            visible=True,
            max_students=2,
            subject=subject2,
        )

        group1 = Group(project=project1)
        group2 = Group(project=project2)

        submission1 = Submission(
            date_time=datetime.now(),
            state=SubmissionState.Pending,
            message="Submission message",
            filename="submission.txt",
            group=group1,
            student=student1,
        )
        submission2 = Submission(
            date_time=datetime.now(),
            state=SubmissionState.Pending,
            message="Submission message",
            filename="submission.txt",
            group=group2,
            student=student1,
        )

        session.add(user1)
        session.add(user2)
        session.add(teacher1)
        session.add(student1)
        session.add(subject1)
        session.add(subject2)
        session.add(project1)
        session.add(project2)
        session.add(group1)
        session.add(group2)
        session.add(submission1)
        session.add(submission2)

        session.commit()
