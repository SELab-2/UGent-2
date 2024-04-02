/*

De variabele 'dummy_data' bevat een voorbeeld van een structuur binnengekregen van de backend.
Deze hoort later ingeladen te worden via een data loader.

*/

export const dummy_data = {
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
                    "type": "directory_constraint",
                    "name": "Other",
                    "sub_constraints": [
                        {
                            "type": "file_constraint",
                            "name": "ResumeNL.pdf"
                        },
                        {
                            "type": "file_constraint",
                            "name": "ResumeEN.pdf"
                        }
                    ]
                },
                {
                    "type": "only_present_directory_constraint",
                    "name": "Other2",
                    "sub_constraints": [
                        {
                            "type": "file_constraint",
                            "name": "Transcript.pdf"
                        }
                    ]
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
        }
    ]
}