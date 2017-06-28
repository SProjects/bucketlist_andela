import os

from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth

from .config import configuration

db = SQLAlchemy()
auth = HTTPBasicAuth()


def create_app(env_name):
    app = Flask(__name__, static_url_path='/static',
                static_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'client/static'))
    app.config.from_object(configuration[env_name])
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    from main.views import main as main_blueprint
    app.register_blueprint(main_blueprint, url_prefix='/')

    from api.v1.auth import auth as auth_v1_blueprint
    api_v1 = Api(auth_v1_blueprint)
    app.register_blueprint(auth_v1_blueprint, url_prefix='/api/v1')
    from api.v1.auth.views import RegisterUser, AuthenticateUser, ValidateToken, Logout
    api_v1.add_resource(RegisterUser, '/auth/register', endpoint='register_endpoint')
    api_v1.add_resource(AuthenticateUser, '/auth/login', endpoint='login_endpoint')
    api_v1.add_resource(ValidateToken, '/validate', endpoint='token_endpoint')
    api_v1.add_resource(Logout, '/logout', endpoint='logout_endpoint')

    from api.v1.users import users as users_v1_blueprint
    api_v1 = Api(users_v1_blueprint)
    app.register_blueprint(users_v1_blueprint, url_prefix='/api/v1')
    from api.v1.users.views import UserEndpoint, UserList
    api_v1.add_resource(UserList, '/users', endpoint='users_endpoint')
    api_v1.add_resource(UserEndpoint, '/users/<int:user_id>', endpoint='user_endpoint')

    from api.v1.bucketlists import bucketlists as bucketlists_v1_blueprint
    api_v1 = Api(bucketlists_v1_blueprint)
    app.register_blueprint(bucketlists_v1_blueprint, url_prefix='/api/v1')
    from api.v1.bucketlists.views import BucketListEndpoint, BucketLists
    api_v1.add_resource(BucketLists, '/bucketlists', endpoint='bucketlists_endpoint')
    api_v1.add_resource(BucketListEndpoint, '/bucketlists/<int:bucketlist_id>',
                        endpoint='bucketlist_endpoint')

    from api.v1.items import items as items_v1_blueprint
    api_v1 = Api(items_v1_blueprint)
    app.register_blueprint(items_v1_blueprint, url_prefix='/api/v1')
    from api.v1.items.views import ItemEndpoint, ItemsList
    api_v1.add_resource(ItemsList, '/bucketlists/<int:bucketlist_id>/items',
                        endpoint='items_endpoint')
    api_v1.add_resource(ItemEndpoint, '/bucketlists/<int:bucketlist_id>/items/<int:item_id>',
                        endpoint='item_endpoint')

    return app
