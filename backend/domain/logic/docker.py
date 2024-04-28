import tempfile
from typing import Any, cast

import docker
from docker.models.images import Image


def build_image(dockerfile: str) -> str:
    client = docker.from_env()
    with tempfile.TemporaryDirectory() as tmpdir, open(f"{tmpdir}/Dockerfile", "w") as f:
        f.write(dockerfile)
    image, _ = cast(tuple[Image, Any], client.images.build(dockerfile=f"{tmpdir}/Dockerfile"))
    return cast(str, image.id)
