import os
import tempfile
from typing import Any, cast

import docker
from docker.models.images import Image
from sqlmodel import Session

from db.extensions import engine
from domain.logic.project import get_project


def build_image(dockerfile: str) -> str:
    client = docker.from_env()
    with tempfile.TemporaryDirectory() as tmpdir:
        with open(f"{tmpdir}/Dockerfile", "w") as f:
            f.write(dockerfile)
        image, _ = cast(tuple[Image, Any], client.images.build(path=tmpdir))
    return str(image.id)


def add_image_id(project_id: int) -> None:
    with Session(engine) as session:
        project = get_project(session, project_id)
        image_id = build_image(project.dockerfile)
        project.image_id = image_id
        session.commit()


def run_container(image_id: str, submission: bytes) -> tuple[str, bool]:
    client = docker.from_env()
    tmpdir = None
    if os.path.isdir("/var/lib/delphi-submissions"):
        tmpdir = "/var/lib/delphi-submissions"
    with tempfile.NamedTemporaryFile(dir=tmpdir) as tmpfile:
        tmpfile.write(submission)
        tmpfile.flush()
        container = client.containers.run(image_id, detach=True, volumes=[f"{tmpfile.name}:/submission:ro"])
        res = container.wait()
        logs = container.logs().decode("utf-8")
        container.remove()
    return logs, res["StatusCode"] == 0
