from flask_restful import Resource, reqparse, abort, marshal, fields

from bucketlist import auth
from bucketlist.models import User, Bucketlist

item_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'date_created': fields.DateTime(attribute='created_at'),
    'date_modified': fields.DateTime(attribute='modified_at'),
    'done': fields.Boolean
}
