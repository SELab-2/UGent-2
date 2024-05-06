/*

De variabele 'dummy_data' bevat een voorbeeld van een structuur binnengekregen van de backend.
Deze hoort later ingeladen te worden via een data loader.

*/

export const dummy_data = `{
    "type": "SUBMISSION",
    "root_constraint": {
        "type": "ZIP",
        "zip_name": "project.zip",
        "sub_constraints": [
            {
                "type": "DIRECTORY",
                "directory_name": "src",
                "sub_constraints": [
                    {
                        "type": "FILE",
                        "file_name": "main.py"
                    },
                    {
                        "type": "DIRECTORY",
                        "directory_name": "utils",
                        "sub_constraints": [
                            {
                                "type": "FILE",
                                "file_name": "helper.py"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "DIRECTORY",
                "directory_name": "tests",
                "sub_constraints": [
                    {
                        "type": "FILE",
                        "file_name": "test_main.py"
                    }
                ]
            },
            {
                "type": "FILE",
                "file_name": "README.md"
            },
            {
                "type": "FILE",
                "file_name": ".gitignore"
            }
        ]
    },
    "global_constraints": [
        {
        "type": "EXTENSION_NOT_PRESENT",
        "extension": ".exe"
        }
    ]
}`
