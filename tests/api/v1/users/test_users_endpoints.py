import json
import base64
from flask_testing import TestCase
from unittest import TestCase as UnitTestCase

import bucketlist
from bucketlist.models.user import User


class TestUsersEndpoint(TestCase, UnitTestCase):
    def create_app(self):
        return bucketlist.create_app('testing')

    def add_users(self):
        user_1 = User(first_name='First1', last_name='Last1', email='first1@email.com', password='test_password')
        user_2 = User(first_name='First2', last_name='Last2', email='first2@email.com', password='test_password')
        user_1.save()
        user_2.save()

    def authorization_headers(self):
        login_credentials = '{}:{}'.format('first1@email.com', 'test_password')
        return {'Authorization': 'Basic ' + base64.b64encode(login_credentials)}

    def setUp(self):
        self.app = self.create_app()
        self.client = self.app.test_client
        self.user_data = {'first_name': 'First', 'last_name': 'Last', 'email': 'first@email.com',
                          'password': 'test_password', 'password_confirm': 'test_password'}

        with self.app.app_context():
            bucketlist.db.session.close()
            bucketlist.db.drop_all()
            bucketlist.db.create_all()

    def tearDown(self):
        bucketlist.db.session.remove()
        bucketlist.db.drop_all()

    def test_returns_all_users(self):
        self.add_users()
        response = self.client().get('/users', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(result), 2)

    def test_returns_empty_list_if_there_are_no_users(self):
        response = self.client().get('/users', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 401)
        self.assertEqual(result['message'], 'Please provide valid login credentials.')

    def test_return_a_single_user_if_id_is_provided(self):
        self.add_users()
        response = self.client().get('/users/1', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertListEqual(result.keys(), ['bucketlists_url', 'first_name', 'last_name', 'id', 'email'])

    def test_fails_with_401_error_if_there_is_no_user_with_provided_id(self):
        self.add_users()
        response = self.client().get('/users/20', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 401)
        self.assertEqual(result['message'], 'User with id#20 not found.')

    def test_delete_endpoint_deletes_a_user_using_a_users_id(self):
        self.add_users()
        self.assertEqual(len(User.query.all()), 2)

        response = self.client().delete('/users/1', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(result['message'], 'User with id#1 successfully deleted.')
        self.assertEqual(len(User.query.all()), 1)

    def test_delete_endpoint_fails_with_401_error_if_there_is_no_user_with_the_provided_id(self):
        self.add_users()
        response = self.client().get('/users/20', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 401)
        self.assertEqual(result['message'], 'User with id#20 not found.')
