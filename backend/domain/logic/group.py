from sqlmodel import Session

from db.models import Group, Project, ProjectStatistics, Student, Submission, SubmissionState
from domain.logic.basic_operations import get, get_all
from domain.logic.submission import get_last_submission, get_submissions_of_group
from errors.database_errors import ActionAlreadyPerformedError, NoSuchRelationError
from errors.logic_errors import ArchivedError


def create_group(session: Session, project_id: int) -> Group:
    """
    Create an empty group for a certain project.
    """
    project: Project = get(session, Project, project_id)
    if project.archived:
        raise ArchivedError
    next_id = 1 if len(project.groups) == 0 else max(project.groups, key=lambda group: group.visible_id).visible_id + 1
    new_group = Group(project_id=project_id, visible_id=next_id)
    project.groups.append(new_group)

    session.add(new_group)
    session.commit()

    return new_group


def get_group(session: Session, group_id: int) -> Group:
    return get(session, Group, group_id)


def get_all_groups(session: Session) -> list[Group]:
    return get_all(session, Group)


def get_groups_of_project(session: Session, project_id: int) -> list[Group]:
    project: Project = get(session, Project, project_id)
    return project.groups


def get_statistics_of_project(session: Session, project_id: int) -> ProjectStatistics:
    project: Project = get(session, Project, project_id)

    stats = ProjectStatistics(
        submissions=0,
        approved=0,
        rejected=0,
        pending=0,
        no_submission=0,
    )

    for group in project.groups:
        modify_stats(stats, session, group)

    return stats


def modify_stats(stats: ProjectStatistics, session: Session, group: Group) -> None:
    submissions_of_group = get_submissions_of_group(session, group.id)

    if len(submissions_of_group) == 0:
        stats.no_submission += 1
        return

    stats.submissions += 1
    latest_submission: Submission = get_last_submission(session, group.id)

    if latest_submission.state == SubmissionState.Approved:
        stats.approved += 1

    elif latest_submission.state == SubmissionState.Rejected:
        stats.rejected += 1

    elif latest_submission.state == SubmissionState.Pending:
        stats.pending += 1


def get_groups_of_student(session: Session, student_id: int) -> list[Group]:
    student: Student = get(session, Student, ident=student_id)
    return student.groups


def add_student_to_group(session: Session, student_id: int, group_id: int) -> None:
    student: Student = get(session, Student, ident=student_id)
    group: Group = get(session, Group, ident=group_id)

    if student in group.students:
        msg = f"Student with id {student_id} already in group with id {group_id}"
        raise ActionAlreadyPerformedError(msg)
    for i in group.project.groups:
        if student in i.students:
            msg = "Student is already in a group for this project"
            raise ActionAlreadyPerformedError(msg)
    group.students.append(student)
    session.commit()


def remove_student_from_group(session: Session, student_id: int, group_id: int) -> None:
    student: Student = get(session, Student, ident=student_id)
    group: Group = get(session, Group, ident=group_id)

    if student not in group.students:
        msg = f"Student with id {student_id} is not in group with id {group_id}"
        raise NoSuchRelationError(msg)

    group.students.remove(student)
    session.commit()


def get_students_of_group(session: Session, group_id: int) -> list[Student]:
    group: Group = get(session, Group, ident=group_id)
    return group.students


def get_group_for_student_and_project(session: Session, student_id: int, project_id: int) -> Group | None:
    student: Student = get(session, Student, ident=student_id)
    project: Project = get(session, Project, ident=project_id)
    for group in project.groups:
        if student in group.students:
            return group
    return None
