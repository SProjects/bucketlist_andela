from flask_restful import Resource, fields, marshal_with, marshal, abort

from bucketlist.models import User

user_fields = {
    'first_name': fields.String,
    'last_name': fields.String,
    'email': fields.String
}


class UserEndpoint(Resource):
    @marshal_with(user_fields)
    def get(self, user_id):
        user = User.query.get(user_id)
        if user:
            return user
        else:
            abort(401, message='User with id#{} not found.'.format(user_id))

    def delete(self, user_id):
        user = User.query.get(user_id)
        if user:
            user.delete()
            response = {'message': 'User with id#{} successfully deleted.'.format(user_id)}
            return response
        else:
            abort(401, message='User with id#{} not found.'.format(user_id))


class UserList(Resource):
    def get(self):
        users = User.get_all()
        return marshal(users, user_fields)
