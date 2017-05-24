from flask_testing import TestCase

import json
import base64
from unittest import TestCase as UnitTestCase

import bucketlist
from bucketlist.models.bucketlist import Bucketlist
from bucketlist.models.item import Item
from bucketlist.models.user import User


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

        response = self.client().post('/api/v1/bucketlists/1/items', data=self.item_data,
                                      headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 201)
        self.assertEqual(result.get('message'), 'Item successfully added to Bucketlist ID#1')

    def test_get_returns_all_items_of_a_bucketlist(self):
        self.add_user()
        self.add_bucketlists()
        self.add_items()

        response = self.client().get('/api/v1/bucketlists/1/items',
                                     headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(result), 2)

    def test_get_returns_an_item_when_item_id_is_provided(self):
        self.add_user()
        self.add_bucketlists()
        self.add_items()

        response = self.client().get('/api/v1/bucketlists/1/items/1',
                                     headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        actual_results = [result.get('name'), result.get('done')]
        self.assertListEqual(actual_results, ['ToDo One', False])

    def test_edit_updates_an_item_of_a_bucketlist(self):
        self.add_user()
        self.add_bucketlists()
        self.add_items()

        response = self.client().get('/api/v1/bucketlists/1/items/1',
                                     headers=self.authorization_headers())
        result = json.loads(response.data.decode())
        actual_results = [result.get('name'), result.get('done')]
        self.assertListEqual(actual_results, ['ToDo One', False])

        update_item_fields = {'name': 'Updated ToDo Item', 'done': True}
        response = self.client().put('/api/v1/bucketlists/1/items/1', data=update_item_fields,
                                     headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        actual_results = [result.get('name'), result.get('done')]
        self.assertListEqual(actual_results, ['Updated ToDo Item', True])

    def test_delete_removes_item_from_bucketlist(self):
        self.add_user()
        self.add_bucketlists()
        self.add_items()

        self.assertEqual(len(Item.query.all()), 3)

        response = self.client().delete('/api/v1/bucketlists/1/items/1',
                                        headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(result.get('message'), 'Item with ID#1 deleted successfully.')
        self.assertEqual(len(Item.query.all()), 2)
