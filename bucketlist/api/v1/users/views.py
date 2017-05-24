from flask_restful import Resource, fields, marshal_with, marshal, abort

from bucketlist.models.user import User
from bucketlist import auth

user_fields = {
    'id': fields.Integer,
    'first_name': fields.String,
    'last_name': fields.String,
    'email': fields.String,
    'bucketlists_url': fields.Url('bucketlists.bucketlists_endpoint', absolute=True)
}


class UserEndpoint(Resource):
    @marshal_with(user_fields)
    @auth.login_required
    def get(self, user_id):
        user = User.query.get(user_id)
        if user:
            return user
        else:
            abort(401, message='User with id#{} not found.'.format(user_id))

    @auth.login_required
    def delete(self, user_id):
        user = User.query.get(user_id)
        if user:
            user.delete()
            response = {'message': 'User with id#{} successfully deleted.'.format(user_id)}
            return response
        else:
            abort(401, message='User with id#{} not found.'.format(user_id))


class UserList(Resource):
    @auth.login_required
    def get(self):
        users = User.query.all()
        return marshal(users, user_fields)
