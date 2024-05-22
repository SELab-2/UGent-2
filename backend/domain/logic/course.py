from sqlmodel import Session

from db.models import Course, CourseInput, Student, Teacher
from domain.logic.basic_operations import get, get_all
from domain.logic.student import is_user_student
from domain.logic.teacher import is_user_teacher
from errors.database_errors import ActionAlreadyPerformedError, NoSuchRelationError


def archive_course(session: Session, course_id: int) -> None:
    course = get_course(session, course_id)
    course.archived = True
    for project in course.projects:
        project.archived = True
    session.commit()


def create_course(session: Session, name: str) -> Course:
    new_course = Course(name=name, archived=False)
    session.add(new_course)
    session.commit()
    return new_course


def get_course(session: Session, course_id: int) -> Course:
    return get(session, Course, course_id)


def get_all_courses(session: Session) -> list[Course]:
    return get_all(session, Course)


def get_courses_of_teacher(session: Session, teacher_id: int) -> list[Course]:
    teacher: Teacher = get(session, Teacher, ident=teacher_id)
    return teacher.courses


def add_student_to_course(session: Session, student_id: int, course_id: int) -> None:
    student: Student = get(session, Student, ident=student_id)
    course: Course = get(session, Course, ident=course_id)

    if course in student.courses:
        msg = f"Student with id {student_id} already has course with id {course_id}"
        raise ActionAlreadyPerformedError(msg)

    student.courses.append(course)
    session.commit()


def add_teacher_to_course(session: Session, teacher_id: int, course_id: int) -> None:
    teacher: Teacher | None = get(session, Teacher, ident=teacher_id)
    course: Course | None = get(session, Course, ident=course_id)

    if course in teacher.courses:
        msg = f"Teacher with id {teacher_id} already has course with id {course_id}"
        raise ActionAlreadyPerformedError(msg)

    teacher.courses.append(course)
    session.commit()


def get_courses_of_student(session: Session, student_id: int) -> list[Course]:
    student: Student = get(session, Student, ident=student_id)
    return student.courses


def is_user_authorized_for_course(course_id: int, session: Session, uid: int) -> bool:
    courses = []
    if is_user_teacher(session, uid):
        courses += get_courses_of_teacher(session, uid)
    if is_user_student(session, uid):
        courses += get_courses_of_student(session, uid)
    if course_id in [course.id for course in courses]:
        return True
    return False


def get_teachers_of_course(session: Session, course_id: int) -> list[Teacher]:
    course: Course = get(session, Course, ident=course_id)
    return course.teachers


def get_students_of_course(session: Session, course_id: int) -> list[Student]:
    course: Course = get(session, Course, ident=course_id)
    return course.students


def remove_student_from_course(session: Session, student_id: int, course_id: int) -> None:
    student = get(session, Student, ident=student_id)
    course = get(session, Course, ident=course_id)

    if course not in student.courses:
        msg = "Student is not enrolled in course"
        raise NoSuchRelationError(msg)

    student.courses.remove(course)
    session.commit()


def remove_teacher_from_course(session: Session, teacher_id: int, course_id: int) -> None:
    teacher = get(session, Teacher, ident=teacher_id)
    course = get(session, Course, ident=course_id)

    if course not in teacher.courses:
        msg = "Teacher doesn't teach course"
        raise NoSuchRelationError(msg)

    teacher.courses.remove(course)
    session.commit()
    if len(course.teachers) == 0:
        archive_course(session, course_id)


def update_course(session: Session, course_id: int, course: CourseInput) -> None:
    course_db = get(session, Course, course_id)
    course_db.archived = course.archived
    course_db.name = course.name
    session.commit()
    if course_db.archived:
        archive_course(session, course_id)
