# Documentation Backend

## 1) Database

#### I) setup

- step 1: Install and set up **PostgreSQL**. We refer to the [official documentation](https://www.postgresql.org/docs/16/admin.html).
- step 2: Start a PostgreSQL server.
- step 3: Create a database on this server.

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

## 3) API

We use **FastAPI** as framework. FastAPI follows the OpenAPI Specification. Its idea is to, in its turn, specify a REST API with a YAML document. This document can be used to generate documentation and methods for API endpoints. In every file in [/routes/], we can see a FastAPI router defined that represents some routes that are logically grouped together.

> A route is a URL pattern that directs HTTP requests to specific handlers or controllers in a web application, defining how requests are processed and responses are generated. It plays a crucial role in organizing the flow of data within the application. \
\- ChatGPT

Every route recieves a session object as a dependency injection, to forward to the corresponding logic operation. Dependencies are components that need to be executed before the route operation function is called. We let FastAPI handle this for us. Other than a database connection through the session object, we sometimes also inject some authentication/authorization logic (see [routes/dependencies/role_dependencies.py]) with corresponding errors in [routes/errors/authentication.py].

For specific documentation about the API-endpoints, start the app and go to /api/docs.

## 4) Running the app

We start by defining app = FastAPI() in [app.py]. Next, we add our routers from the previous section. We also add some exception handlers using the corresponding tag. FastAPI calls these handlers for us if needed. this way, we only have to return a corresponding JSONResponse. Finally, we start the app using a **uvicorn** server. This is the standard for FastApi. "app:app" specifies the location of the FastApi object. The first "app" refers to the module (i.e., app.py), and the second "app" refers to the variable (i.e., the FastAPI application object). By default, Uvicorn will run on the localhost port 8000. Another thing to note in this file is that we provide [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) functionality for the local version only.