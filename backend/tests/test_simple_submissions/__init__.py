import shutil
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

    # Create a zip file
    zip_path = path / zip_name
    shutil.make_archive(str(zip_path), "zip", path)
