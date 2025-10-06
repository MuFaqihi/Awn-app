from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()

def create_app(config_object='app.config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_object)
    db.init_app(app)
    Migrate(app, db)

    from .auth import auth_bp
    from .appointments import appt_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(appt_bp, url_prefix='/appointments')

    return app
