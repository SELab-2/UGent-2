import tempfile

from domain.simple_submission_checks.constraints.directory_constraint import DirectoryConstraint
from domain.simple_submission_checks.constraints.zip_constraint import ZipConstraint

json_string = {
  "type": "zip_constraint",
  "name": "root.zip",
  "sub_constraints": [
    {
      "type": "directory_constraint",
      "name": "Documents",
      "sub_constraints": [
        {
          "type": "file_constraint",
          "name": "Resume.pdf"
        },
        {
          "type": "file_constraint",
          "name": "CoverLetter.docx"
        },
        {
          "type": "file_constraint",
          "name": "Transcript.pdf"
        }
      ]
    },
    {
      "type": "directory_constraint",
      "name": "Images",
      "sub_constraints": [
        {
          "type": "file_constraint",
          "name": "Vacation.jpg"
        },
        {
          "type": "file_constraint",
          "name": "ProfilePicture.jpg"
        }
      ]
    },
    {
      "type": "directory_constraint",
      "name": "Videos",
      "sub_constraints": [
        {
          "type": "file_constraint",
          "name": "Graduation.mp4"
        }
      ]
    },
    {
      "type": "not_present_constraint",
      "name": "file4.txt"
    }
  ]
}

# Parse the JSON to a Pydantic model
constraint = ZipConstraint.parse_obj(json_string)

# Path to the directory to validate
path_to_directory = "/home/lukasbt/"
# Validate the directory and print the result
validation_result = constraint.validate_constraint(path_to_directory)
print(validation_result)
