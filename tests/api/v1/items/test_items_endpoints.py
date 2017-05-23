from flask_testing import TestCase

import json
import base64
from unittest import TestCase as UnitTestCase

import bucketlist
from bucketlist.models import Bucketlist, Item, User


class TestItemsEndpoints(TestCase, UnitTestCase):
    def create_app(self):
        return bucketlist.create_app('testing')

    def add_user(self):
        user = User(first_name='First', last_name='Last', email='first@email.com', password='test_password')
        user.save()

    def add_bucketlists(self):
        bucketlist_1 = Bucketlist(name='Bucketlist One', user_id=1)
        bucketlist_2 = Bucketlist(name='Bucketlist Two', user_id=1)
        bucketlist_1.save(), bucketlist_2.save()

    def add_items(self):
        item_1 = Item(name='ToDo One', bucketlist_id=1)
        item_2 = Item(name='ToDo Two', bucketlist_id=1)
        item_3 = Item(name='ToDo Two', bucketlist_id=2)
        item_1.save(), item_2.save(), item_3.save()

    def authorization_headers(self):
        login_credentials = '{}:{}'.format('first@email.com', 'test_password')
        return {'Authorization': 'Basic ' + base64.b64encode(login_credentials)}

    def token_headers(self, token):
        login_credentials = '{}:{}'.format(token, 'unused_password')
        return {'Authorization': 'Basic ' + base64.b64encode(login_credentials)}

    def setUp(self):
        self.app = self.create_app()
        self.client = self.app.test_client
        self.item_data = {'name': 'ToDo Item'}

        with self.app.app_context():
            bucketlist.db.session.close()
            bucketlist.db.drop_all()
            bucketlist.db.create_all()

    def tearDown(self):
        bucketlist.db.session.remove()
        bucketlist.db.drop_all()

    def test_post_adds_new_item_to_bucketlist(self):
        self.add_user()
        self.add_bucketlists()

        self.assertEqual(len(Item.query.all()), 0)

        response = self.client().post('/bucketlists/1/items', data=self.item_data,
                                      headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 201)
        self.assertEqual(result.get('message'), 'Item successfully added to Bucketlist ID#1')

    def test_get_returns_all_items_of_a_bucketlist(self):
        self.add_user()
        self.add_bucketlists()
        self.add_items()

        response = self.client().get('/bucketlists/1/items', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(result), 2)
