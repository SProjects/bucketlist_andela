from flask import g
from flask_restful import Resource, reqparse, abort, marshal, fields, marshal_with

from bucketlist import auth
from bucketlist.models import User, Bucketlist
from ..items.views import item_fields

bucketlist_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'items': fields.Nested(item_fields),
    'date_created': fields.DateTime(attribute='created_at'),
    'date_modified': fields.DateTime(attribute='modified_at'),
    'created_by': fields.Integer(attribute='user_id')
}


class BucketListEndpoint(Resource):
    @auth.login_required
    @marshal_with(bucketlist_fields)
    def get(self, bucketlist_id):
        current_user = g.user
        bucketlist = Bucketlist.query.filter_by(id=bucketlist_id, user=current_user).first()
        if bucketlist:
            return bucketlist, 200
        abort(403, message='Bucketlist of ID#{} not found or does not belong to you.'.format(bucketlist_id))

    def put(self, bucketlist_id):
        pass

    def delete(self, bucketlist_id):
        pass


class BucketLists(Resource):
    @auth.login_required
    def get(self):
        current_user = g.user
        if current_user:
            bucketlists = Bucketlist.query.filter_by(user=current_user).all()
            return marshal(bucketlists, bucketlist_fields), 200
        else:
            abort(403, message='You are not authenticated. Login.')

    @auth.login_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, help='Bucketlist name is required', required=True)
        arguments = parser.parse_args()
        name = arguments.get('name')

        current_user = g.user
        if current_user:
            try:
                bucketlist = Bucketlist(name=name, user=current_user)
                bucketlist.save()
                response = {'message': 'Bucketlist created successfully.'}
                return response, 201
            except Exception as e:
                abort(401, message='Failed to create new bucketlist -> {}'.format(e.message))
        else:
            abort(403, message='You are not authenticated. Login.')
