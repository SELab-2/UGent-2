from flask import Flask
from backend.routes.extentions import db
from backend.routes.lesgevers import lesgevers_blueprint

app = Flask(__name__)

# Koppel routes uit andere modules.
app.register_blueprint(lesgevers_blueprint)

# Koppel postgres uri en db aan app instantie
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:postgres@localhost:5432/testdb'
db.init_app(app)


@app.route('/')
def hello_world():
    return 'Hello, World!'


if __name__ == '__main__':
    app.run(debug=True)
