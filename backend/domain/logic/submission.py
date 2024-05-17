import shutil
import tempfile
from datetime import datetime
from pathlib import Path

from sqlmodel import Session

from db.models import Group, Student, Submission, SubmissionState
from domain.logic.basic_operations import get, get_all
from domain.logic.project import get_project
from domain.simple_submission_checks.constraints.submission_constraint import create_constraint_from_json
from errors.database_errors import ItemNotFoundError
from errors.logic_errors import ArchivedError, InvalidSubmissionError


def create_submission(
    session: Session,
    student_id: int,
    group_id: int,
    message: str,
    state: SubmissionState,
    date_time: datetime,
    filename: str,
) -> Submission:
    """
    Create a submission for a certain project by a certain group.
    """
    student: Student = get(session, Student, ident=student_id)
    group: Group = get(session, Group, ident=group_id)

    if group.project.archived:
        raise ArchivedError

    new_submission: Submission = Submission(
        student_id=student.id,
        group_id=group.id,
        message=message,
        state=state,
        date_time=date_time,
        filename=filename,
    )
    session.add(new_submission)
    session.commit()
    return new_submission


def get_submission(session: Session, submission_id: int) -> Submission:
    return get(session, Submission, submission_id)


def get_all_submissions(session: Session) -> list[Submission]:
    return get_all(session, Submission)


def get_submissions_of_student(session: Session, student_id: int) -> list[Submission]:
    student: Student = get(session, Student, ident=student_id)
    return student.submissions


def get_submissions_of_group(session: Session, group_id: int) -> list[Submission]:
    group: Group = get(session, Group, ident=group_id)
    return group.submissions


def get_last_submission(session: Session, group_id: int) -> Submission:
    submissions = get_submissions_of_group(session, group_id)
    if len(submissions) == 0:
        err_string = "No submissions for this group"
        raise ItemNotFoundError(err_string)
    return max(submissions, key=lambda submission: submission.date_time)


def check_submission(session: Session, group_id: int, path: str) -> None:
    group = get(session, Group, group_id)
    project = group.project
    constraints = create_constraint_from_json(project.requirements)
    validation = constraints.validate_constraint(Path(path))
    if not validation.is_ok:
        raise InvalidSubmissionError(validation)


def zip_all_submissions(session: Session, project_id: int) -> bytes:
    project = get_project(session, project_id)
    with tempfile.TemporaryDirectory() as tmpdir:
        for group in project.groups:
            if len(group.submissions) == 0:
                continue
            submission = get_last_submission(session, group.id)
            if not Path.exists(Path(submission.filename)):
                continue
            submission_path = Path(tmpdir) / f"{group.visible_id}-{submission.filename.split("/")[-1]}"
            shutil.copy(submission.filename, submission_path)
        with tempfile.TemporaryDirectory() as zipdir:
            shutil.make_archive(f"{zipdir}/submissions", "zip", tmpdir)
            with open(f"{zipdir}/submissions.zip", "rb") as file:
                return file.read()
