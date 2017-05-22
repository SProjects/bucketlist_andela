from flask_restful import Resource, reqparse, abort

from bucketlist import auth
from bucketlist.models import User, Bucketlist


class BucketListEndpoint(Resource):
    def get(self, bucketlist_id):
        pass

    def put(self, bucketlist_id):
        pass

    def delete(self, bucketlist_id):
        pass


class BucketLists(Resource):
    def get(self):
        pass

    @auth.login_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, help='Bucketlist name is required', required=True)
        parser.add_argument('user_id', type=str, help='User ID is required', required=True)

        arguments = parser.parse_args()
        name, user_id = arguments.get('name'), arguments.get('user_id')

        user = User.query.get(user_id)
        if user:
            try:
                bucketlist = Bucketlist(name=name, user=user)
                bucketlist.save()
                response = {'message': 'Bucketlist created successfully.'}
                return response, 201
            except Exception as e:
                abort(401, message='Failed to create new bucketlist -> {}'.format(e.message))
        else:
            abort(403, message='Failed to find user with ID#{}'.format(user_id))
