# test_project.py
import unittest
from datetime import datetime

from sqlmodel import SQLModel

from domain.logic.course import add_student_to_course, add_teacher_to_course, create_course
from domain.logic.project import (
    create_project,
    get_all_projects,
    get_project,
    get_projects_of_course,
    get_projects_of_student,
    get_projects_of_teacher,
)
from domain.logic.student import create_student
from domain.logic.teacher import create_teacher
from tests.crud.test_main import get_db, test_engine


class TestProject(unittest.TestCase):
    def setUp(self) -> None:
        SQLModel.metadata.drop_all(test_engine)
        SQLModel.metadata.create_all(test_engine)
        self.session = next(get_db())

    def tearDown(self) -> None:
        self.session.rollback()
        self.session.close()

    def test_create_and_get_project(self) -> None:
        course = create_course(self.session, "Test Course")
        project = create_project(
            self.session,
            course.id,
            "Test Project",
            datetime.now(),
            False,
            "Test Description",
            "Test Requirements",
            True,
            2,
            "",
        )
        retrieved_project = get_project(self.session, project.id)
        self.assertEqual(project.id, retrieved_project.id)

    def test_get_all_projects(self) -> None:
        course1 = create_course(self.session, "Test Course 1")
        course2 = create_course(self.session, "Test Course 2")
        create_project(
            self.session,
            course1.id,
            "Test Project 1",
            datetime.now(),
            False,
            "Test Description",
            "Test Requirements",
            True,
            2,
            "",
        )
        create_project(
            self.session,
            course2.id,
            "Test Project 2",
            datetime.now(),
            False,
            "Test Description",
            "Test Requirements",
            True,
            2,
            "",
        )
        self.assertEqual(len(get_all_projects(self.session)), 2)

    def test_get_projects_of_course(self) -> None:
        course = create_course(self.session, "Test Course")
        create_project(
            self.session,
            course.id,
            "Test Project 1",
            datetime.now(),
            False,
            "Test Description",
            "Test Requirements",
            True,
            2,
            "",
        )
        create_project(
            self.session,
            course.id,
            "Test Project 2",
            datetime.now(),
            False,
            "Test Description",
            "Test Requirements",
            True,
            2,
            "",
        )
        projects_of_course = get_projects_of_course(self.session, course.id)
        self.assertEqual(len(projects_of_course), 2)

    def test_get_projects_of_student(self) -> None:
        student = create_student(self.session, "Test Student", "teststudent@gmail.com")
        course1 = create_course(self.session, "Test Course 1")
        course2 = create_course(self.session, "Test Course 2")
        add_student_to_course(self.session, student.id, course1.id)
        add_student_to_course(self.session, student.id, course2.id)
        create_project(
            self.session,
            course1.id,
            "Test Project 1",
            datetime.now(),
            False,
            "Test Description",
            "Test Requirements",
            True,
            2,
            "",
        )
        create_project(
            self.session,
            course2.id,
            "Test Project 2",
            datetime.now(),
            False,
            "Test Description",
            "Test Requirements",
            True,
            2,
            "",
        )
        projects_of_student = get_projects_of_student(self.session, student.id)
        self.assertEqual(len(projects_of_student), 2)

    def test_get_projects_of_teacher(self) -> None:
        teacher = create_teacher(self.session, "Test Teacher", "testteacher@gmail.com")
        course1 = create_course(self.session, "Test Course 1")
        course2 = create_course(self.session, "Test Course 2")
        add_teacher_to_course(self.session, teacher.id, course1.id)
        add_teacher_to_course(self.session, teacher.id, course2.id)
        create_project(
            self.session,
            course1.id,
            "Test Project 1",
            datetime.now(),
            False,
            "Test Description",
            "Test Requirements",
            True,
            2,
            "",
        )
        create_project(
            self.session,
            course2.id,
            "Test Project 2",
            datetime.now(),
            False,
            "Test Description",
            "Test Requirements",
            True,
            2,
            "",
        )
        projects_of_teacher = get_projects_of_teacher(self.session, teacher.id)
        self.assertEqual(len(projects_of_teacher), 2)


if __name__ == "__main__":
    unittest.main()
