# Docs Simple Submission Constraints

## Constraints

### [SubmissionConstraint](./submission_constraint.py)

Een `SubmissionConstraint` legt de structuur van een indiening vast. 
Een `SubmissionConstraint` heeft een `root_constraint` en lijst `global_constraints`.

- De `root_constraint` kan ofwel een `ZipConstraint` of een `FileConstraint` zijn, aangezien een indiening een 
zip-bestand of een normaal bestand kan zijn. 

- De lijst van `global_constraints` bevat een lijst met constraints 
van het type `NotPresentConstraint` of `ExtensionNotPresentConstraint`.

Een `SubmissionConstraint` in json-formaat zal er zo uit zien:

```json
{
  "type": "SUBMISSION",
  "root_constraint": <ZipConstraint | FileConstraint>,
  "global_constraints": [<NotPresentConstraint | ExtensionNotPresentConstraint>],
}
```
### [ZipConstraint](./zip_constraint.py)

Een `ZipConstraint` kan enkel gebruikt worden als `root_constraint` van een `SubmissionConstraint`.
Deze constraint checkt of de indiening een zip bestand is en legt nog verdere constraints op de rest van het zip-bestand.
Een `ZipConstraint` heeft een `zip_name` (str) en een lijst `sub_constraints`. 

De `zip_name` legt de naam van de lijst vast en de `sub_constraints` bevat een lijst van constraints van volgende types:

- `DirectoryConstraint`
- `FileConstraint`
- `NotPresentConstraint`
- `ExtensionNotPresentConstraint`

Een `ZipConstraint` in json-formaat zal er zo uit zien:

```json
{
  "type": "ZIP",
  "zip_name": "<naam>.zip",
  "sub_constraints": [<DirectoryConstraint | FileConstraint | NotPresentConstraint | ExtensionNotPresentConstraint | ExtensionOnlyPresentConstraint>]
}
```

### [DirectoryConstraint](./directory_constraint.py)

Een `DirectoryConstraint` legt op dat er een bepaalde map aanwezig moet zijn. Deze Constraint heeft als attributen
een `directory_name` (str) en een lijst `sub_constraints`. De mogelijk types in `sub_constraints` zijn dezelfde als die van de `ZipConstraint`.

Een `DirectoryConstraint` in json-formaat zal er zo uit zien:

```json
{
  "type": "DIRECTORY",
  "directory_name": "<naam>",
  "sub_constraints": [<DirectoryConstraint | FileConstraint | NotPresentConstraint | ExtensionNotPresentConstraint | ExtensionOnlyPresentConstraint>]
}
```

### [FileConstraint](./file_constraint.py)

Een `FileConstraint` legt op dat er een bepaald bestand aanwezig moet zijn. Deze Constraint heeft naast het type 
maar één attribuut, namelijk `file_name` (str).

Een `FileConstraint` in json-formaat zal er zo uit zien:

```json
{
  "type": "FILE",
  "file_name": "<naam>"
}
```

### [NotPresentConstraint](./not_present_constraint.py)

Een `NotPresentConstraint` legt op dat een bepaald bestand of map niet aanwezig mag zijn. Deze Constraint heeft naast het type
maar één attribuut, namelijk `file_or_directory_name` (str).

Een `NotPresentConstraint` in json-formaat zal er zo uit zien:

```json
{
  "type": "NOT_PRESENT",
  "file_or_directory_name": "<naam>"
}
```

### [ExtensionNotPresentConstraint](./extension_not_present_constraint.py)

Een `ExtensionNotPresentConstraint` legt op dat bestanden met een bepaalde extensie niet aanwezig mogen zijn. 
Deze Constraint heeft naast het type maar één attribuut, namelijk `extension` (str).

Een `ExtensionNotPresentConstraint` in json-formaat zal er zo uit zien:

```json
{
  "type": "EXTENSION_NOT_PRESENT",
  "extension": "<extensie>"
}
```

## [ConstraintResult](./constraint_result.py)

Om te weten of een indiening voldoet aan de constraints heeft elke constraint overeenkomstige ConstraintResult.
Deze hebben allemaal een type en een boolean `is_ok` die aangeeft of de constraint voldaan is. Verder kunnen deze
nog velden hebben die aangeven wat er juist is misgelopen.

### SubmissionConstraintResult

Bij een `SubmissionConstraintResult` staat het `is_ok` veld op waar wanneer alle onderliggende constraints voldaan zijn.
Het heeft ook nog twee extra velden: `root_constraint_result` en `global_constraint_result`. Deze  
Een `SubmissionConstraintResult` in json-formaat zal er zo uit zien:

```json
{
  "type": "SUBMISSION",
  "is_ok": true,
  "root_constraint_result": <ZipConstraintResult | FileConstraintResult>,
  "global_constraint_result": GlobalConstraintResult,
  "sub_constraint_results": [*altijd leeg*]
}
```

### ZipConstraintResult

Bij een `ZipConstraintResult` staat het `is_ok` veld op waar wanneer De zip de juiste naam heeft.
Deze heeft naast het type en `is_ok` veld nog het `sub_constraint_results` veld, wat een lijst is van de resultaten 
van alle sub_constraints gedefinieerd in de `ZipConstraint`.

Een `ZipConstraintResult` in json-formaat zal er zo uit zien:

```json
{
  "type": "ZIP",
  "is_ok": true,
  "sub_constraint_results": [<DirectoryConstraintResult | FileConstraintResult | NotPresentConstraintResult | ExtensionNotPresentConstraintResult | ExtensionOnlyPresentConstraintResult>]
}
```


### DirectoryConstraintResult

Bij een `DirectoryConstraintResult` staat het `is_ok` veld op waar wanneer er een map de juiste naam bestaat.
Deze heeft als extra veld `directory_name` (str) dat de naam van de map bevat en net zoals de `ZipConstraintResult`
een `sub_constraint_results` veld.

Een `DirectoryConstraintResult` in json-formaat zal er zo uit zien:

```json
{
    "type": "DIRECTORY",
    "is_ok": true,
    "sub_constraint_results": [<DirectoryConstraintResult | FileConstraintResult | NotPresentConstraintResult | ExtensionNotPresentConstraintResult | ExtensionOnlyPresentConstraintResult>],
    "directory_name": "<name>>"
}
```

### FileConstraintResult

Bij een `FileConstraintResult` staat het `is_ok` veld op waar wanneer er een bestand met de juiste naam bestaat.
Deze heeft als extra veld `file_name` (str) dat de naam van het bestand bevat.

Een `FileConstraintResult` in json-formaat zal er zo uit zien:

```json
{
    "type": "FILE",
    "is_ok": true,
    "file_name": "<name>",
    "sub_constraint_results": [*altijd leeg*]
}
```

### NotPresentConstraintResult

Bij een `NotPresentConstraintResult` staat het `is_ok` veld op waar wanneer er geen bestand of map met de gegeven naam bestaat.
Het heeft één extra veld `file_or_directory_name` (str) dat de naam van het bestand of map bevat.

Een `NotPresentConstraintResult` in json-formaat zal er zo uit zien:

```json
{
    "type": "NOT_PRESENT",
    "is_ok": true,
    "file_or_directory_name": "<naam>",
    "sub_constraint_results": [*altijd leeg*]
}
```

### ExtensionNotPresentConstraintResult

Bij een `ExtensionNotPresentConstraintResult` staat het `is_ok` veld op waar wanneer er geen bestand met de gegeven extensie bestaat.
Het heeft twee extra velden: `extension` (str), dat de extensie van het bestand bevat en `files_with_extension`, 
wat een lijst is met alle gevonden bestanden in die map met de gegeven extensie.

Een `ExtensionNotPresentConstraintResult` in json-formaat zal er zo uit zien:

```json
{
    "type": "EXTENSION_NOT_PRESENT",
    "is_ok": true,
    "extension": "<extensie>",
    "files_with_extension": [
      "<naam>",
      ...
    ],
    "sub_constraint_results": [*altijd leeg*]
}
```

### GlobalConstraintResult

Een `GlobalConstraintResult` zet het `is_ok` veld op waar wanneer alle globale constraints voldaan zijn.
Als extra attribuut heeft het een lijst `global_constraint_results`. Dit is een lijst van key-value paren, 
met als key de map waarin één of meerdere constraints fout gingen, en als value een lijst van de gefaalde resultaten.

Een `GlobalConstraintResult` in json-formaat zal er zo uit zien:

```json
{
  "type": "GLOBAL",
  "is_ok": false,
  "global_constraint_results": {
    "<map>": [<NotPresentConstraintResult | ExtensionNotPresentConstraintResult>],
    ...
  },
  "sub_constraint_results": [*altijd leeg*]
}
```

## Voorbeeld

Stel dat de indiening volgende structuur heeft:

```
project.zip
├── src
│   ├── main.py
│   └── utils
│       ├── helper.py
│       ├── extra_file.txt
│       └── malware.exe
├── tests
│   └── test_main.py
├── README.md
├── .gitignore
├── dist
└── extra.log
```

Dit kan een constraint zijn:

```json
{
  "type": "SUBMISSION",
  "is_ok": false,
  "sub_constraint_results": [],
  "root_constraint_result": {
    "type": "ZIP",
    "is_ok": true,
    "sub_constraint_results": [
      {
        "type": "DIRECTORY",
        "is_ok": true,
        "sub_constraint_results": [
          {
            "type": "FILE",
            "is_ok": true,
            "sub_constraint_results": [],
            "file_name": "main.py"
          },
          {
            "type": "DIRECTORY",
            "is_ok": true,
            "sub_constraint_results": [
              {
                "type": "FILE",
                "is_ok": true,
                "sub_constraint_results": [],
                "file_name": "helper.py"
              },
              {
                "type": "NOT_PRESENT",
                "is_ok": false,
                "sub_constraint_results": [],
                "file_or_directory_name": "extra_file.txt"
              }
            ],
            "directory_name": "utils"
          }
        ],
        "directory_name": "src"
      },
      {
        "type": "DIRECTORY",
        "is_ok": true,
        "sub_constraint_results": [
          {
            "type": "FILE",
            "is_ok": true,
            "sub_constraint_results": [],
            "file_name": "test_main.py"
          }
        ],
        "directory_name": "tests"
      },
      {
        "type": "FILE",
        "is_ok": true,
        "sub_constraint_results": [],
        "file_name": "README.md"
      },
      {
        "type": "FILE",
        "is_ok": true,
        "sub_constraint_results": [],
        "file_name": ".gitignore"
      },
      {
        "type": "NOT_PRESENT",
        "is_ok": false,
        "sub_constraint_results": [],
        "file_or_directory_name": "dist"
      },
      {
        "type": "EXTENSION_NOT_PRESENT",
        "is_ok": false,
        "sub_constraint_results": [],
        "extension": ".log",
        "files_with_extension": [
          "extra.log"
        ]
      }
    ],
    "zip_name": "project.zip"
  },
  "global_constraint_result": {
    "type": "GLOBAL",
    "is_ok": false,
    "sub_constraint_results": [],
    "global_constraint_results": {
      "src/utils": [
        {
          "type": "EXTENSION_NOT_PRESENT",
          "is_ok": false,
          "sub_constraint_results": [],
          "extension": ".exe",
          "files_with_extension": [
            "malware.exe"
          ]
        }
      ]
    }
  }
}
```

En dit is de overeenkomstige constraint result op de constraint.

```json
{
  "type": "SUBMISSION",
  "is_ok": false,
  "sub_constraint_results": [],
  "root_constraint_result": {
    "type": "ZIP",
    "is_ok": true,
    "sub_constraint_results": [
      {
        "type": "DIRECTORY",
        "is_ok": true,
        "sub_constraint_results": [
          {
            "type": "FILE",
            "is_ok": true,
            "sub_constraint_results": [],
            "file_name": "main.py"
          },
          {
            "type": "DIRECTORY",
            "is_ok": true,
            "sub_constraint_results": [
              {
                "type": "FILE",
                "is_ok": true,
                "sub_constraint_results": [],
                "file_name": "helper.py"
              },
              {
                "type": "NOT_PRESENT",
                "is_ok": false,
                "sub_constraint_results": [],
                "file_or_directory_name": "extra_file.txt"
              }
            ],
            "directory_name": "utils"
          }
        ],
        "directory_name": "src"
      },
      {
        "type": "DIRECTORY",
        "is_ok": true,
        "sub_constraint_results": [
          {
            "type": "FILE",
            "is_ok": true,
            "sub_constraint_results": [],
            "file_name": "test_main.py"
          }
        ],
        "directory_name": "tests"
      },
      {
        "type": "FILE",
        "is_ok": true,
        "sub_constraint_results": [],
        "file_name": "README.md"
      },
      {
        "type": "FILE",
        "is_ok": true,
        "sub_constraint_results": [],
        "file_name": ".gitignore"
      },
      {
        "type": "NOT_PRESENT",
        "is_ok": false,
        "sub_constraint_results": [],
        "file_or_directory_name": "dist"
      },
      {
        "type": "EXTENSION_NOT_PRESENT",
        "is_ok": false,
        "sub_constraint_results": [],
        "extension": ".log",
        "files_with_extension": [
          "extra.log"
        ]
      }
    ],
    "zip_name": "project.zip"
  },
  "global_constraint_result": {
    "type": "GLOBAL",
    "is_ok": false,
    "sub_constraint_results": [],
    "global_constraint_results": {
      "src/utils": [
        {
          "type": "EXTENSION_NOT_PRESENT",
          "is_ok": false,
          "sub_constraint_results": [],
          "extension": ".exe",
          "files_with_extension": [
            "malware.exe"
          ]
        }
      ]
    }
  }
}
```


