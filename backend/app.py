import os

from flask import Flask

from db.extensions import db
from routes.teachers import teachers_blueprint

app = Flask(__name__)

# Koppel routes uit andere modules.
app.register_blueprint(teachers_blueprint)

db_host = os.getenv("DB_HOST", "localhost")
db_port = os.getenv("DB_PORT", "5432")
db_user = os.getenv("DB_USERNAME", "postgres")
db_password = os.getenv("DB_PASSWORD", "postgres")
db_database = os.getenv("DB_DATABASE", "delphi")

# Koppel postgres uri en db aan app instantie
app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_database}"
db.init_app(app)


@app.route("/")
def hello_world():
    return "Hello, World!"


if __name__ == "__main__":
    app.run(debug=True)
