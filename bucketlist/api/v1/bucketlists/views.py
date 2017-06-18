from flask import g
from flask import url_for
from flask_restful import Resource, reqparse, abort, marshal, fields, marshal_with
from sqlalchemy import desc

from math import ceil

from bucketlist import auth
from bucketlist.config import Config
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
        abort(400, message='Bucketlist of ID#{} not found or does not belong to you.'.format(bucketlist_id))

    @auth.login_required
    @marshal_with(bucketlist_fields)
    def put(self, bucketlist_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, help='Bucketlist name is required', required=True)
        arguments = parser.parse_args()
        name = arguments.get('name')

        current_user = g.user
        bucketlist = Bucketlist.query.filter_by(id=bucketlist_id, user=current_user).first()
        if bucketlist:
            bucketlist.name = name
            bucketlist.save()
            return bucketlist, 200
        else:
            abort(400, message='Bucketlist with ID#{} not found or not yours.'.format(bucketlist_id))

    @auth.login_required
    def delete(self, bucketlist_id):
        current_user = g.user
        bucketlist = Bucketlist.query.filter_by(id=bucketlist_id, user=current_user).first()
        if bucketlist:
            bucketlist.delete()
            response = {'message': 'Bucketlist with ID#{} successfully deleted.'.format(bucketlist_id)}
            return response, 200
        else:
            abort(400, message='Bucketlist with ID#{} not found or not yours.'.format(bucketlist_id))


class BucketLists(Resource):
    @auth.login_required
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('q', type=str, help='Search term is missing.', required=False)
        parser.add_argument('limit', type=str, help='Limit is missing.', required=False)
        parser.add_argument('page', type=str)

        arguments = parser.parse_args()
        search_term = arguments.get('q', None)
        page_size = arguments.get('limit', None)
        page = arguments.get('page') or 0

        current_user = g.user
        if search_term is not None:
            bucketlists = Bucketlist.query.\
                filter(Bucketlist.name.like('%' + search_term + '%'),
                       Bucketlist.user == current_user).order_by(desc(Bucketlist.created_at)).all()
            return dict(results=marshal(bucketlists, bucketlist_fields)), 200

        if page_size is None:
            bucketlists = Bucketlist.query.filter_by(user=current_user).\
                order_by(desc(Bucketlist.created_at)).all()
            response = dict(results=marshal(bucketlists, bucketlist_fields))
        else:
            page = int(page)
            page_size = int(page_size) if int(page_size) < Config.MAX_PAGE_SIZE else Config.MAX_PAGE_SIZE
            response = self._paginate(page, page_size, current_user)
        return response, 200

    @auth.login_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, help='Bucketlist name is required', required=True)
        arguments = parser.parse_args()
        name = arguments.get('name')

        current_user = g.user
        try:
            bucketlist = Bucketlist(name=name, user=current_user)
            bucketlist.save()
            response = {'message': 'Bucketlist created successfully.'}
            return response, 201
        except Exception as e:
            abort(400, message='Failed to create new bucketlist -> {}'.format(e.message))

    def _paginate(self, page, page_size, current_user):
        num_results = Bucketlist.query.filter(Bucketlist.user == current_user).count()

        total_pages = int(ceil(float(num_results) / float(page_size)))
        bucketlists = Bucketlist.query.filter(Bucketlist.user == current_user).\
            order_by(desc(Bucketlist.created_at)).limit(page_size).offset(page * page_size).all()

        navigation = {'total_pages': total_pages, 'num_results': num_results, 'page': page + 1}
        if page == 1:
            navigation['prev'] = url_for('bucketlists.bucketlists_endpoint') + '?limit={}'.format(page_size)

        if page > 1:
            navigation['prev'] = url_for('bucketlists.bucketlists_endpoint') + '?limit={}&page={}'.format(page_size,
                                                                                                          page - 1)
        if (page + 1) < total_pages:
            navigation['next'] = url_for('bucketlists.bucketlists_endpoint') + '?limit={}&page={}'.format(page_size,
                                                                                                          page + 1)
        result = dict(results=marshal(bucketlists, bucketlist_fields))
        return dict(list(result.items()) + list(navigation.items()))
