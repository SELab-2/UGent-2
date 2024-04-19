# test_student.py
import unittest

from sqlmodel import SQLModel

from domain.logic.course import add_student_to_course, create_course, get_courses_of_student
from domain.logic.student import create_student, get_all_students, get_student
from tests.crud.test_main import get_db, test_engine


class TestStudent(unittest.TestCase):
    def setUp(self) -> None:
        SQLModel.metadata.drop_all(test_engine)
        SQLModel.metadata.create_all(test_engine)
        self.session = next(get_db())

    def tearDown(self) -> None:
        self.session.rollback()
        self.session.close()

    def test_create_and_get_student(self) -> None:
        student = create_student(self.session, "Test Student", "teststudent@gmail.com")
        retrieved_student = get_student(self.session, student.id)
        self.assertEqual(student.id, retrieved_student.id)

    def test_get_all_students(self) -> None:
        create_student(self.session, "Test Student 1", "teststudent1@gmail.com")
        create_student(self.session, "Test Student 2", "teststudent2@gmail.com")
        self.assertEqual(len(get_all_students(self.session)), 2)

    def test_add_student_to_course(self) -> None:
        student = create_student(self.session, "Test Student", "teststudent@gmail.com")
        course = create_course(self.session, "Test Course")
        add_student_to_course(self.session, student.id, course.id)
        courses_of_student = get_courses_of_student(self.session, student.id)
        self.assertIn(course.id, [course.id for course in courses_of_student])


if __name__ == "__main__":
    unittest.main()
