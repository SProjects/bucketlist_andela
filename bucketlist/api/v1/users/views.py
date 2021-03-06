from flask import g
from flask import request
from flask_restful import Resource, fields, marshal_with, marshal, abort, reqparse
from sqlalchemy import desc

from bucketlist.models.user import User
from bucketlist import auth
from bucketlist.errors.user import PasswordError
from bucketlist.utils.utilities import validate_email

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
        parser = reqparse.RequestParser()
        parser.add_argument('token', type=bool)
        arguments = parser.parse_args()

        use_token = arguments.get('token') or None

        if use_token:
            return g.user

        user = User.query.get(user_id)
        if user:
            return user
        else:
            abort(400, message='User with id#{} not found.'.format(user_id))

    @auth.login_required
    @marshal_with(user_fields)
    def put(self, user_id):
        arguments = request.get_json(force=True)

        first_name, last_name = arguments.get('first_name') or None, arguments.get('last_name') or None
        email = arguments.get('email') or None
        old_password, new_password = arguments.get('old_password') or None, arguments.get('password') or None
        new_password_confirm = arguments.get('password_confirm') or None

        if email is not None and not validate_email(email):
            return abort(401, message='Email address is invalid.')

        current_user = g.user
        if current_user.id == user_id:
            try:
                if old_password is not None and new_password is not None and new_password_confirm is not None:
                    if not current_user.check_password(old_password):
                        raise PasswordError('Incorrect old password.')

                    if new_password == new_password_confirm:
                        current_user.password = new_password
                    else:
                        raise PasswordError('New passwords don\'t match.')

                current_user.first_name = first_name if first_name is not None else current_user.first_name
                current_user.last_name = last_name if last_name is not None else current_user.last_name
                current_user.email = email if email is not None else current_user.email
                current_user.save()
                return current_user, 200
            except Exception as e:
                abort(400, message='Failed to update user -> {}'.format(e.message))
        else:
            abort(403, message='You can\'t edit another user\'s data.')

    @auth.login_required
    def delete(self, user_id):
        user = User.query.get(user_id)
        if user:
            user.delete()
            response = {'message': 'User with id#{} successfully deleted.'.format(user_id)}
            return response
        else:
            abort(400, message='User with id#{} not found.'.format(user_id))


class UserList(Resource):
    @auth.login_required
    def get(self):
        users = User.query.order_by(desc(User.created_at)).all()
        return dict(results=marshal(users, user_fields)), 200
