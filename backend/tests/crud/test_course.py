# test_course.py
import unittest

from sqlmodel import SQLModel

from domain.logic.course import (
    add_student_to_course,
    add_teacher_to_course,
    create_course,
    get_all_courses,
    get_course,
    get_courses_of_student,
    get_courses_of_teacher,
)
from domain.logic.student import create_student
from domain.logic.teacher import create_teacher
from tests.crud.test_main import get_db, test_engine


class TestCourse(unittest.TestCase):
    def setUp(self) -> None:
        SQLModel.metadata.drop_all(test_engine)
        SQLModel.metadata.create_all(test_engine)
        self.session = next(get_db())

    def tearDown(self) -> None:
        self.session.rollback()
        self.session.close()

    def test_create_and_get_course(self) -> None:
        course = create_course(self.session, "Test Course")
        retrieved_course = get_course(self.session, course.id)
        self.assertEqual(course.id, retrieved_course.id)

    def test_get_all_courses(self) -> None:
        create_course(self.session, "Test Course 1")
        create_course(self.session, "Test Course 2")
        self.assertEqual(len(get_all_courses(self.session)), 2)

    def test_add_student_to_course(self) -> None:
        student = create_student(self.session, "Test Student", "teststudent@gmail.com")
        course = create_course(self.session, "Test Course")
        add_student_to_course(self.session, student.id, course.id)
        courses_of_student = get_courses_of_student(self.session, student.id)
        self.assertIn(course.id, [course.id for course in courses_of_student])

    def test_add_teacher_to_course(self) -> None:
        teacher = create_teacher(self.session, "Test Teacher", "testteacher@gmail.com")
        course = create_course(self.session, "Test Course")
        add_teacher_to_course(self.session, teacher.id, course.id)
        courses_of_teacher = get_courses_of_teacher(self.session, teacher.id)
        self.assertIn(course.id, [course.id for course in courses_of_teacher])


if __name__ == "__main__":
    unittest.main()
