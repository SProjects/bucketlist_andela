import json
from flask_testing import TestCase
from unittest import TestCase as UnitTestCase

import bucketlist


class TestRegisterUser(TestCase, UnitTestCase):
    def create_app(self):
        return bucketlist.create_app('testing')

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

    def test_user_registration(self):
        response = self.client().post('/auth/register', data=self.user_data)
        result = json.loads(response.data.decode())

        self.assertEqual(result['message'], 'You registered successfully.')

    def test_already_registered_user(self):
        response = self.client().post('/auth/register', data=self.user_data)
        self.assertEqual(response.status_code, 201)

        second_response = self.client().post('/auth/register', data=self.user_data)
        self.assertEqual(second_response.status_code, 202)

        result = json.loads(second_response.data.decode())
        self.assertEqual(result['message'], 'User already exists. Login.')

    def test_user_registration_fails_with_401_error_is_password_and_password_confirmation_values_do_not_match(self):
        user_data = {'first_name': 'First', 'last_name': 'Last', 'email': 'first@email.com',
                     'password': 'test_password', 'password_confirm': 'different_test_password'}

        response = self.client().post('/auth/register', data=user_data)

        self.assertEqual(response.status_code, 401)
        self.assertIn('Password and password confirmation don\'t match', response.data)
