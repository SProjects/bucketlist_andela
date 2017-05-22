from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

from .config import configuration

db = SQLAlchemy()


def create_app(env_name):
    app = Flask(__name__)
    app.config.from_object(configuration[env_name])
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    api_v1 = Api(app)
    from api.v1.auth.views import RegisterUser, AuthenticateUser
    api_v1.add_resource(RegisterUser, '/auth/register')
    api_v1.add_resource(AuthenticateUser, '/auth/login')

    from api.v1.users.views import UserEndpoint, UserList
    api_v1.add_resource(UserList, '/users')
    api_v1.add_resource(UserEndpoint, '/users/<int:user_id>')

    from api.v1.auth import auth as auth_v1_blueprint
    from api.v1.users import users as users_v1_blueprint
    app.register_blueprint(auth_v1_blueprint, url_prefix='/api/v1')
    app.register_blueprint(users_v1_blueprint, url_prefix='/api/v1')

    return app
