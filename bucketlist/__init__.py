from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth

from .config import configuration

db = SQLAlchemy()
auth = HTTPBasicAuth()


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

    from api.v1.bucketlists.views import BucketListEndpoint, BucketLists
    api_v1.add_resource(BucketLists, '/bucketlists')
    api_v1.add_resource(BucketListEndpoint, '/bucketlists/<int:bucketlist_id>')

    from api.v1.items.views import ItemEndpoint, ItemsList
    api_v1.add_resource(ItemsList, '/bucketlists/<int:bucketlist_id>/items')
    api_v1.add_resource(ItemEndpoint, '/bucketlists/<int:bucketlist_id>/items/<int:item_id>')

    from api.v1.auth import auth as auth_v1_blueprint
    from api.v1.users import users as users_v1_blueprint
    from api.v1.bucketlists import bucketlists as bucketlists_v1_blueprint
    from api.v1.items import items as items_v1_blueprint
    app.register_blueprint(auth_v1_blueprint, url_prefix='/api/v1')
    app.register_blueprint(users_v1_blueprint, url_prefix='/api/v1')
    app.register_blueprint(bucketlists_v1_blueprint, url_prefix='/api/v1')
    app.register_blueprint(items_v1_blueprint, url_prefix='/api/v1')

    return app
