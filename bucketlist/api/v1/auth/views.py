from flask import g
from flask import request
from flask_restful import abort, Resource

from bucketlist.models.user import User
from bucketlist.utils.utilities import validate


class RegisterUser(Resource):
    def post(self):
        arguments = request.get_json(force=True)

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
        arguments = request.get_json(force=True)
        email, password = arguments.get('email'), arguments.get('password')

        if validate(email, password):
            return {'token': g.user.generate_token()}, 200
        return abort(401, message='Wrong email or password combination. Try again.')


