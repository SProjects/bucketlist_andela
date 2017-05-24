from flask_restful import Resource, reqparse, abort, marshal, fields, marshal_with

from bucketlist import auth
from bucketlist.models.item import Item
from bucketlist.models.bucketlist import Bucketlist

item_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'date_created': fields.DateTime(attribute='created_at'),
    'date_modified': fields.DateTime(attribute='modified_at'),
    'done': fields.Boolean
}


class ItemEndpoint(Resource):
    @auth.login_required
    @marshal_with(item_fields)
    def get(self, bucketlist_id, item_id):
        bucketlist = Bucketlist.query.get(bucketlist_id)
        item = Item.query.filter_by(id=item_id, bucketlist=bucketlist).first()
        if item:
            return item, 200
        abort(400, message='Item with ID#{} not found.'.format(item_id))

    @auth.login_required
    @marshal_with(item_fields)
    def put(self, bucketlist_id, item_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, help='Item name is required', required=True)
        parser.add_argument('done', type=str, help='Item status', required=False)
        arguments = parser.parse_args()
        name, done = arguments.get('name'), arguments.get('done', False)

        bucketlist = Bucketlist.query.get(bucketlist_id)
        item = Item.query.filter_by(id=item_id, bucketlist=bucketlist).first()
        if item:
            try:
                item.name = name
                item.done = done
                item.save()
                return item, 200
            except Exception as e:
                return abort(400, message='Failed to update item -> {}'.format(e.message))
        abort(400, message='Item with ID#{} not found.'.format(item_id))

    @auth.login_required
    def delete(self, bucketlist_id, item_id):
        bucketlist = Bucketlist.query.get(bucketlist_id)
        item = Item.query.filter_by(id=item_id, bucketlist=bucketlist).first()
        if item:
            try:
                item.delete()
                response = {'message': 'Item with ID#1 deleted successfully.'.format(item_id)}
                return response, 200
            except Exception as e:
                return abort(400, message='Failed to delete item -> {}'.format(e.message))
        abort(400, message='Item with ID#{} not found.'.format(item_id))


class ItemsList(Resource):
    @auth.login_required
    def get(self, bucketlist_id):
        bucketlist = Bucketlist.query.get(bucketlist_id)
        if bucketlist:
            items = bucketlist.items
            return marshal(items, item_fields), 200
        else:
            abort(400, message='Bucketlist with ID#{} not found.'.format(bucketlist_id))

    @auth.login_required
    def post(self, bucketlist_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, help='Item name is required', required=True)
        arguments = parser.parse_args()
        name = arguments.get('name')

        bucketlist = Bucketlist.query.get(bucketlist_id)
        if bucketlist:
            try:
                item = Item(name=name, bucketlist=bucketlist)
                item.save()
                response = {'message': 'Item successfully added to Bucketlist ID#{}'.format(bucketlist_id)}
                return response, 201
            except Exception as e:
                abort(400, message='Failed to create item -> {}'.format(e.message))
        else:
            abort(400, message='Bucketlist with ID#{} not found.'.format(bucketlist_id))
