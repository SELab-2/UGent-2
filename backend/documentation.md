# Documentation Backend

## 1) Database

#### I) setup

Check the README.md for installation.

We use **SQLAlchemy** to access this database in our backend app. SQLAlchemy allows us to start defining tables, performing queries, etc.. The setup of SQLAlchemy happens in [db/extensions.py]. Here, an SQLAlchemy engine is created. This engine is the component that manages connections to the database. A [database URI](https://docs.sqlalchemy.org/en/20/core/engines.html) is needed to create such an engine. Because we host the backend app and the database in the same place, we use localhost in the URI as default. This is not mandatory; the database and backend app are two seperate things.

For test purposes, mockup data is available in [fill_database_mock.py]. A visual representation of the database is also recommended (eg. [pgAdmin](https://www.pgadmin.org/)).

#### II) tables

Using our EER diagram, we now want to create the corresponding tables. We use SQLAlchemy's declarative base pattern. Start by defining a Base class. This class contains the necessary functionality to interact with the database. Next, we create a python class for each table we need, and make it inherit the Base class. We call this a model (see [db/models/models.py]). For specifics on how to define these models, see [this link](https://docs.sqlalchemy.org/en/20/orm/declarative_styles.html#using-a-declarative-base-class). 

An important thing to notice in this file is that other than the Base class, all models also inherit a class named AbstractModel. It makes sure that each model implements *to_domain_model*. We will come back to this function later on.


#### III) sessions

A SQLAlchemy session object provides an extra abstract layer to the engine. We will use these session objects in the logic part of our domain layer (see later).

> Using SQLAlchemy session objects simplifies database interactions by encapsulating transactions, providing features such as identity management, automatic transaction management, and a unit of work pattern, promoting cleaner, more maintainable code. \
\- ChatGPT

In [db/sessions.py], we define a generator for these session objects using our engine.

## 2) Domain layer

#### I) operations
in [domain/logic/] we define the actual backend functionality. Examples are *get_subjects_of_teacher* or *create_submission*. Some things to notice is that every function needs a session object, and that we manually commit changes. In [domain/logic/basic_operations.py], we define an abstract *get* and *get_all*, as these type of operations happen a lot. This *get* is of course not the same as a get request to the API. Three main errors that we provide manual coverage for are ItemNotFoundError, ActionAlreadyPerformedError and NoSuchRelationError (see [db/errors/]).

#### II) dataclasses

Now is a good time to explain the function *to_domain_model* from earlier. When we call a logic function, we don't want to return an instance of the Base class from SQLAlchemy. Instead we want to return very universal objects with that correspond one-to-one with an entity + attribute from our EER diagram. That's what a dataclass is. They are defined in [domain/models/]. 

> In our code, we use the name dataclass for two seperate things. The first is the @dataclass tag from the standard python library [dataclasses](https://docs.python.org/3/library/dataclasses.html). The other is the domain layer object just explained like SubmissionDataclass and TeacherDataclass.

These universal dataclasses inherit the **Pydantic** BaseModel. It allows for automatic data validation, JSON schema generation and more. More information on Pydantic can be found [here](https://docs.pydantic.dev/latest/why/).

#### III) simple submission tests

[simple_submission_checks](domain/simple_submission_checks) contains the logic to run simple tests on a submission. simple tests can check if the submission
- Is a zip file with a certain name
- Is a file with a certain name
- Contains a certain file or folder
- Does not contain a certain file or folder

These constraints can be nested indefinitely. 

The frontend should send a json file containing a `SubmissionConstraint`. Such a submission constraint hase a `root_constraint`
which is one of two things: A `FileConstraint` or a `Zipconstraint`, as a submission is OR a file, OR a zip file.
A `FileConstraint` simply checks if a file with a certain name is present. The `ZipConstraint` also contains a name field specifying the name of the zip file, along
with a list of either `FileConstrainst`, `DirectoryConstraint` or `NotPresentConstraints`. These can be mixed.
A `DirectoryConstraint` also has a name field and a list of constraints. The `NotPresentConstraint` specifies that a certain file may not be present in that directory or zip.

For the frontend people: If you want to know how to make a `Submissionconstraint` you can look at the models in the [simple_submission_checks](domain/simple_submission_checks) folder. The following is an example:

```json
 {
  "type": "zip_constraint",
  "name": "root.zip",
  "sub_constraints": [
    {
      "type": "directory_constraint",
      "name": "Documents",
      "sub_constraints": [
        {
          "type": "file_constraint",
          "name": "Resume.pdf",
        },
        {
          "type": "file_constraint",
          "name": "CoverLetter.docx",
        },
        {
          "type": "file_constraint",
          "name": "Transcript.pdf",
        },
      ],
    },
    {
      "type": "directory_constraint",
      "name": "Images",
      "sub_constraints": [
        {
          "type": "file_constraint",
          "name": "Vacation.jpg",
        },
        {
          "type": "file_constraint",
          "name": "ProfilePicture.jpg",
        },
      ],
    },
    {
      "type": "directory_constraint",
      "name": "Videos",
      "sub_constraints": [
        {
          "type": "file_constraint",
          "name": "Graduation.mp4",
        },
      ],
    },
    {
      "type": "not_present_constraint",
      "name": "file4.txt",
    },
  ],
}
```

## 3) API

We use **FastAPI** as framework. FastAPI follows the OpenAPI Specification. Its idea is to, in its turn, specify a REST API with a YAML document. This document can be used to generate documentation and methods for API endpoints. In every file in [/routes/], we can see a FastAPI router defined that represents some routes that are logically grouped together.

> A route is a URL pattern that directs HTTP requests to specific handlers or controllers in a web application, defining how requests are processed and responses are generated. It plays a crucial role in organizing the flow of data within the application. \
\- ChatGPT

Every route recieves a session object as a dependency injection, to forward to the corresponding logic operation. Dependencies are components that need to be executed before the route operation function is called. We let FastAPI handle this for us. Other than a database connection through the session object, we sometimes also inject some authentication/authorization logic (see [routes/dependencies/role_dependencies.py]) with corresponding errors in [routes/errors/authentication.py].

For specific documentation about the API-endpoints, start the app and go to /api/docs.

## 4) Running the app

We start by defining app = FastAPI() in [app.py]. Next, we add our routers from the previous section. We also add some exception handlers using the corresponding tag. FastAPI calls these handlers for us if needed. this way, we only have to return a corresponding JSONResponse. Finally, we start the app using a **uvicorn** server. This is the standard for FastApi. "app:app" specifies the location of the FastApi object. The first "app" refers to the module (i.e., app.py), and the second "app" refers to the variable (i.e., the FastAPI application object). By default, Uvicorn will run on the localhost port 8000. Another thing to note in this file is that we provide [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) functionality for the local version only.