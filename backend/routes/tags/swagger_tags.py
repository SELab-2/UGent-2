from enum import Enum


class Tags(Enum):
    GROUP   = "Group methods"
    LOGIN   = "Login methods"
    PROJECT = "Project methods"
    STUDENT = "Student methods"
    SUBJECT = "Subject methods"
    TEACHER = "Teacher methods"
    USER    = "User methods"

class _TagsDescription(Enum):
    GROUP   = "All methods related to a group."
    LOGIN   = "All methods related to logging in."
    PROJECT = "All methods related to a project."
    STUDENT = "All methods related to a student."
    SUBJECT = "All methods related to a subject."
    TEACHER = "All methods related to a teacher."
    USER    = "All methods related to a user."

tags_metadata = [{"name": tag, "description": _TagsDescription[tag.name]} for tag in Tags]
