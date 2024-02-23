from backend.db.extentions import db
from backend.routes.teachers import teachers_blueprint
from flask import Flask

app = Flask(__name__)

# Koppel routes uit andere modules.
app.register_blueprint(teachers_blueprint)

# Koppel postgres uri en db aan app instantie
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:postgres@localhost:5432/testdb"
db.init_app(app)


@app.route("/")
def hello_world():
    return "Hello, World!"


if __name__ == "__main__":
    app.run(debug=True)