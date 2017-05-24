from flask import g
from flask_restful import Resource, reqparse, abort, marshal, fields, marshal_with

from bucketlist import auth
from bucketlist.models.bucketlist import Bucketlist
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

    @auth.login_required
    @marshal_with(bucketlist_fields)
    def put(self, bucketlist_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, help='Bucketlist name is required', required=True)
        arguments = parser.parse_args()
        name = arguments.get('name')

        bucketlist = Bucketlist.query.get(bucketlist_id)
        if bucketlist:
            bucketlist.name = name
            bucketlist.save()
            return bucketlist, 200
        else:
            abort(400, message='Bucketlist with ID#{} not found.'.format(bucketlist_id))

    def delete(self, bucketlist_id):
        bucketlist = Bucketlist.query.get(bucketlist_id)
        if bucketlist:
            bucketlist.delete()
            response = {'message': 'Bucketlist with ID#{} successfully deleted.'.format(bucketlist_id)}
            return response, 200
        else:
            abort(400, message='Bucketlist with ID#{} not found.'.format(bucketlist_id))


class BucketLists(Resource):
    @auth.login_required
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('q', type=str, help='Search term is missing.', required=False)
        arguments = parser.parse_args()
        search_term = arguments.get('q', None)

        current_user = g.user
        if current_user:
            if search_term is not None:
                bucketlists = Bucketlist.query.filter(Bucketlist.name.like('%' + search_term + '%'),
                                                      Bucketlist.user == current_user).all()
                return marshal(bucketlists, bucketlist_fields), 200
            
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
