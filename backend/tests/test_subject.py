# test_subject.py
import unittest

from test_main import SessionLocal, test_engine

from db.extensions import Base
from domain.logic.student import create_student
from domain.logic.subject import (
    add_student_to_subject,
    add_teacher_to_subject,
    create_subject,
    get_all_subjects,
    get_subject,
    get_subjects_of_student,
    get_subjects_of_teacher,
)
from domain.logic.teacher import create_teacher


class TestSubject(unittest.TestCase):
    def setUp(self) -> None:
        Base.metadata.drop_all(test_engine)
        Base.metadata.create_all(test_engine)
        self.session = SessionLocal()

    def tearDown(self) -> None:
        self.session.rollback()
        self.session.close()

    def test_create_and_get_subject(self) -> None:
        subject = create_subject(self.session, "Test Subject")
        retrieved_subject = get_subject(self.session, subject.id)
        self.assertEqual(subject.id, retrieved_subject.id)

    def test_get_all_subjects(self) -> None:
        create_subject(self.session, "Test Subject 1")
        create_subject(self.session, "Test Subject 2")
        self.assertEqual(len(get_all_subjects(self.session)), 2)

    def test_add_student_to_subject(self) -> None:
        student = create_student(self.session, "Test Student", "teststudent@gmail.com")
        subject = create_subject(self.session, "Test Subject")
        add_student_to_subject(self.session, student.id, subject.id)
        subjects_of_student = get_subjects_of_student(self.session, student.id)
        self.assertIn(subject.id, [subject.id for subject in subjects_of_student])

    def test_add_teacher_to_subject(self) -> None:
        teacher = create_teacher(self.session, "Test Teacher", "testteacher@gmail.com")
        subject = create_subject(self.session, "Test Subject")
        add_teacher_to_subject(self.session, teacher.id, subject.id)
        subjects_of_teacher = get_subjects_of_teacher(self.session, teacher.id)
        self.assertIn(subject.id, [subject.id for subject in subjects_of_teacher])


if __name__ == "__main__":
    unittest.main()
