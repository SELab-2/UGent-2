import tempfile
from typing import Any, cast

import docker
from docker.models.images import Image


def build_image(dockerfile: str) -> str:
    client = docker.from_env()
    with tempfile.TemporaryDirectory() as tmpdir:
        with open(f"{tmpdir}/Dockerfile", "w") as f:
            f.write(dockerfile)
        image, _ = cast(tuple[Image, Any], client.images.build(path=tmpdir))
    return cast(str, image.id)


def run_container(image_id: str) -> bool:
    client = docker.from_env()
    container = client.containers.run(image_id, detach=True, remove=True)
    return container.wait() == 0
