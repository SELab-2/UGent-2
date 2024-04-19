from enum import Enum


class Tags(Enum):
    GROUP = "Group methods"
    LOGIN = "Login methods"
    PROJECT = "Project methods"
    STUDENT = "Student methods"
    COURSE = "Course methods"
    TEACHER = "Teacher methods"
    USER = "User methods"
    SUBMISSION = "Submission methods"


class _TagsDescription(Enum):
    GROUP = "All methods related to a group."
    LOGIN = "All methods related to logging in."
    PROJECT = "All methods related to a project."
    STUDENT = "All methods related to a student."
    COURSE = "All methods related to a course."
    TEACHER = "All methods related to a teacher."
    USER = "All methods related to a user."
    SUBMISSION = "All methods related to a submission."


tags_metadata = [{"name": tag, "description": _TagsDescription[tag.name]} for tag in Tags]
