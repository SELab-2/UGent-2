# test_project.py
import unittest
from datetime import datetime

from sqlmodel import SQLModel
from test_main import get_db, test_engine

from domain.logic.project import (
    create_project,
    get_all_projects,
    get_project,
    get_projects_of_student,
    get_projects_of_subject,
    get_projects_of_teacher,
)
from domain.logic.student import create_student
from domain.logic.subject import add_student_to_subject, add_teacher_to_subject, create_subject
from domain.logic.teacher import create_teacher


class TestProject(unittest.TestCase):
    def setUp(self) -> None:
        SQLModel.metadata.drop_all(test_engine)
        SQLModel.metadata.create_all(test_engine)
        self.session = next(get_db())

    def tearDown(self) -> None:
        self.session.rollback()
        self.session.close()

    def test_create_and_get_project(self) -> None:
        subject = create_subject(self.session, "Test Subject")
        project = create_project(self.session, subject.id, "Test Project", datetime.now(), False, "Test Description",
                                 "Test Requirements", True, 2)
        retrieved_project = get_project(self.session, project.id)
        self.assertEqual(project.id, retrieved_project.id)

    def test_get_all_projects(self) -> None:
        subject1 = create_subject(self.session, "Test Subject 1")
        subject2 = create_subject(self.session, "Test Subject 2")
        create_project(self.session, subject1.id, "Test Project 1", datetime.now(), False, "Test Description",
                       "Test Requirements", True, 2)
        create_project(self.session, subject2.id, "Test Project 2", datetime.now(), False, "Test Description",
                       "Test Requirements", True, 2)
        self.assertEqual(len(get_all_projects(self.session)), 2)

    def test_get_projects_of_subject(self) -> None:
        subject = create_subject(self.session, "Test Subject")
        create_project(self.session, subject.id, "Test Project 1", datetime.now(), False, "Test Description",
                       "Test Requirements", True, 2)
        create_project(self.session, subject.id, "Test Project 2", datetime.now(), False, "Test Description",
                       "Test Requirements", True, 2)
        projects_of_subject = get_projects_of_subject(self.session, subject.id)
        self.assertEqual(len(projects_of_subject), 2)

    def test_get_projects_of_student(self) -> None:
        student = create_student(self.session, "Test Student", "teststudent@gmail.com")
        subject1 = create_subject(self.session, "Test Subject 1")
        subject2 = create_subject(self.session, "Test Subject 2")
        add_student_to_subject(self.session, student.id, subject1.id)
        add_student_to_subject(self.session, student.id, subject2.id)
        create_project(self.session, subject1.id, "Test Project 1", datetime.now(), False, "Test Description",
                       "Test Requirements", True, 2)
        create_project(self.session, subject2.id, "Test Project 2", datetime.now(), False, "Test Description",
                       "Test Requirements", True, 2)
        projects_of_student = get_projects_of_student(self.session, student.id)
        self.assertEqual(len(projects_of_student), 2)

    def test_get_projects_of_teacher(self) -> None:
        teacher = create_teacher(self.session, "Test Teacher", "testteacher@gmail.com")
        subject1 = create_subject(self.session, "Test Subject 1")
        subject2 = create_subject(self.session, "Test Subject 2")
        add_teacher_to_subject(self.session, teacher.id, subject1.id)
        add_teacher_to_subject(self.session, teacher.id, subject2.id)
        create_project(self.session, subject1.id, "Test Project 1", datetime.now(), False, "Test Description",
                       "Test Requirements", True, 2)
        create_project(self.session, subject2.id, "Test Project 2", datetime.now(), False, "Test Description",
                       "Test Requirements", True, 2)
        projects_of_teacher = get_projects_of_teacher(self.session, teacher.id)
        self.assertEqual(len(projects_of_teacher), 2)


if __name__ == "__main__":
    unittest.main()
