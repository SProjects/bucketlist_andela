from flask_testing import TestCase

import json
import base64
from unittest import TestCase as UnitTestCase

import bucketlist
from bucketlist.models import Bucketlist


class TestBucketListEndpoints(TestCase, UnitTestCase):
    def create_app(self):
        return bucketlist.create_app('testing')

    def add_bucketlists(self):
        bucketlist_1 = Bucketlist(name='Bucketlist One', user_id=1)
        bucketlist_2 = Bucketlist(name='Bucketlist Two', user_id=1)
        bucketlist_3 = Bucketlist(name='Bucketlist Three', user_id=1)
        bucketlist_1.save()
        bucketlist_2.save()
        bucketlist_3.save()

    def authorization_headers(self):
        login_credentials = '{}:{}'.format('first@email.com', 'test_password')
        return {'Authorization': 'Basic ' + base64.b64encode(login_credentials)}

    def token_headers(self, token):
        login_credentials = '{}:{}'.format(token, 'unused_password')
        return {'Authorization': 'Basic ' + base64.b64encode(login_credentials)}

    def setUp(self):
        self.app = self.create_app()
        self.client = self.app.test_client
        self.user_data = {'first_name': 'First', 'last_name': 'Last', 'email': 'first@email.com',
                          'password': 'test_password', 'password_confirm': 'test_password'}
        self.bucketlist_data = {'name': 'Bucket List Name'}

        with self.app.app_context():
            bucketlist.db.session.close()
            bucketlist.db.drop_all()
            bucketlist.db.create_all()

    def tearDown(self):
        bucketlist.db.session.remove()
        bucketlist.db.drop_all()

    def test_post_adds_new_bucketlist(self):
        self.client().post('/auth/register', data=self.user_data)
        login_credentials = dict(email=self.user_data.get('email'),
                                 password=self.user_data.get('password'))
        response = self.client().post('/auth/login', data=login_credentials)
        result = json.loads(response.data.decode())
        token = result['token']

        response = self.client().post('/bucketlists', data=self.bucketlist_data,
                                      headers=self.token_headers(token))
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Bucketlist.query.all()), 1)
        self.assertEqual(result['message'], 'Bucketlist created successfully.')

    def test_get_returns_all_bucketlists_for_user(self):
        self.client().post('/auth/register', data=self.user_data)
        self.add_bucketlists()
        response = self.client().get('/bucketlists', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(result), 3)

    def test_get_returns_one_bucketlist_if_id_is_specified(self):
        self.client().post('/auth/register', data=self.user_data)
        self.add_bucketlists()
        response = self.client().get('/bucketlists/1', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        expected_list = sorted(['id', 'name', 'items', 'date_created', 'date_modified', 'created_by'])
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(sorted([str(key) for key in result.keys()]), expected_list)
        self.assertListEqual([result.get('name'), result.get('created_by')], ['Bucketlist One', 1])
