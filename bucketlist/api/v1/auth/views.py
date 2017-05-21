from flask import make_response, jsonify
from flask_restful import reqparse, abort, Resource

from bucketlist.models import User


class RegisterUser(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('first_name', type=str, help='First name is required', required=True)
        parser.add_argument('last_name', type=str, help='Last name is required', required=True)
        parser.add_argument('email', type=str, help='Email is required', required=True)
        parser.add_argument('password', type=str, help='Password is required', required=True)

        arguments = parser.parse_args()

        first_name, last_name = arguments.get('first_name'), arguments.get('last_name')
        email, password = arguments.get('email'), arguments.get('password')

        try:
            if not User.exists(email):
                user = User(first_name=first_name, last_name=last_name, email=email, password=password)
                user.save()
                response = {'message': 'You registered successfully.'}
                return response, 201
            else:
                response = {'message': 'User already exists. Login.'}
                return response, 202
        except Exception as e:
            abort(401, message='Error while creating your account: {}'.format(e.message))


class AuthenticateUser(Resource):
    pass

