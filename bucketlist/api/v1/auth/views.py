from flask import g
from flask_restful import reqparse, abort, Resource

from bucketlist.models.user import User
from bucketlist.utils.utilities import validate


class RegisterUser(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('first_name', type=str, help='First name is required', required=True)
        parser.add_argument('last_name', type=str, help='Last name is required', required=True)
        parser.add_argument('email', type=str, help='Email is required', required=True)
        parser.add_argument('password', type=str, help='Password is required', required=True)
        parser.add_argument('password_confirm', type=str, help='Password confirmation is required', required=True)

        arguments = parser.parse_args()

        first_name, last_name = arguments.get('first_name'), arguments.get('last_name')
        email, password = arguments.get('email'), arguments.get('password')
        password_confirm = arguments.get('password_confirm')

        if password != password_confirm:
            return abort(401, message='Password and confirmation password don\'t match')

        try:
            if not User(email=email).exists():
                user = User(first_name=first_name, last_name=last_name, email=email, password=password)
                user.save()
                response = {'message': 'You registered successfully.'}
                return response, 201
            else:
                response = {'message': 'User already exists. Login.'}
                return response, 409
        except Exception as e:
            abort(401, message='Error while creating your account: {}'.format(e.message))


class AuthenticateUser(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, help='Email is required', required=True)
        parser.add_argument('password', type=str, help='Password is required', required=True)

        arguments = parser.parse_args()
        email, password = arguments.get('email'), arguments.get('password')

        if validate(email, password):
            return {'token': g.user.generate_token()}, 200
        return abort(401, message='Wrong email or password combination. Try again.')


