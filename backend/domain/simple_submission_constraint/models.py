from __future__ import annotations
from pydantic import BaseModel
from typing import Optional, Literal


class SubmissionConstraint(BaseModel):
    submission_root: File | Directory


class File(BaseModel):
    type: Literal["file"]
    name: str


class Directory(BaseModel):
    type: Literal["directory"]
    name: str
    must_contain: Optional[list[Directory | File]] = None
    must_not_contain: Optional[list[Directory | File]] = None


# Needed to enable self-referencing model
Directory.update_forward_refs()


json_example = {
  "type": "directory",
  "name": "root",
  "must_contain": [
    {
      "type": "directory",
      "name": "Documents",
      "must_contain": [
        {
          "type": "file",
          "name": "Resume.pdf"
        },
        {
          "type": "file",
          "name": "CoverLetter.docx"
        }
      ]
    },
    {
      "type": "directory",
      "name": "Images",
      "must_contain": [
        {
          "type": "file",
          "name": "Vacation.jpg"
        }
      ]
    },
    {
      "type": "file",
      "name": "file4.txt"
    }
  ]
}


instance_a = Directory.parse_obj(json_example)

print(instance_a)
