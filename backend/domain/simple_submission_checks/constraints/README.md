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
  "type": "submission_constraint",
  "root_constraint": <ZipConstraint | FileConstraint>,
  "global_constraints": [<NotPresentConstraint | ExtensionNotPresentConstraint>]
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
  "type": "zip_constraint",
  "zip_name": "<naam>.zip",
  "sub_constraints": [<DirectoryConstraint | FileConstraint | NotPresentConstraint | ExtensionNotPresentConstraint>]
}
```

### [DirectoryConstraint](./directory_constraint.py)

Een `DirectoryConstraint` legt op dat er een bepaalde map aanwezig moet zijn. Deze Constraint heeft als attributen
een `directory_name` (str) en een lijst `sub_constraints`. De mogelijk types in `sub_constraints` zijn dezelfde als die van de `ZipConstraint`.

Een `DirectoryConstraint` in json-formaat zal er zo uit zien:

```json
{
  "type": "directory_constraint",
  "directory_name": "<naam>",
  "sub_constraints": [<DirectoryConstraint | FileConstraint | NotPresentConstraint | ExtensionNotPresentConstraint>]
}
```

### [FileConstraint](./file_constraint.py)

Een `FileConstraint` legt op dat er een bepaald bestand aanwezig moet zijn. Deze Constraint heeft naast het type 
maar één attribuut, namelijk `file_name` (str).

Een `FileConstraint` in json-formaat zal er zo uit zien:

```json
{
  "type": "file_constraint",
  "file_name": "<naam>"
}
```

### [NotPresentConstraint](./not_present_constraint.py)

Een `NotPresentConstraint` legt op dat een bepaald bestand of map niet aanwezig mag zijn. Deze Constraint heeft naast het type
maar één attribuut, namelijk `file_or_directory_name` (str).

Een `NotPresentConstraint` in json-formaat zal er zo uit zien:

```json
{
  "type": "not_present_constraint",
  "file_or_directory_name": "<naam>"
}
```

### [ExtensionNotPresentConstraint](./extension_not_present_constraint.py)

Een `ExtensionNotPresentConstraint` legt op dat bestanden met een bepaalde extensie niet aanwezig mogen zijn. 
Deze Constraint heeft naast het type maar één attribuut, namelijk `extension` (str).

Een `ExtensionNotPresentConstraint` in json-formaat zal er zo uit zien:

```json
{
  "type": "extension_not_present_constraint",
  "extension": "<extensie>"
}
```


