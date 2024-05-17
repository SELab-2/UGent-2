import shutil
import tempfile
from pathlib import Path


def create_structure(structure: dict, path: Path) -> None:
    for key, value in structure.items():
        new_path = path / key
        if value is None:
            # It's a file, touch it
            new_path.touch()
        else:
            # It's a directory, make it and recurse
            new_path.mkdir()
            create_structure(value, new_path)


def create_directory_and_zip(structure: dict, path: Path, zip_name: str) -> None:
    # Create directory structure
    create_structure(structure, path)

    # Create a temporary directory for the zip file
    with tempfile.TemporaryDirectory() as tmp_zip_dir:
        tmp_zip_path = Path(tmp_zip_dir) / zip_name
        # Create a zip file in the temporary directory
        shutil.make_archive(str(tmp_zip_path), "zip", path)
        # Move the zip file to the desired location
        shutil.move(str(tmp_zip_path) + ".zip", path)
