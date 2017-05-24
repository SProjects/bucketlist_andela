from flask_testing import TestCase
from unittest import TestCase as UnitTestCase

import bucketlist


class TestAuthenticateUser(TestCase, UnitTestCase):
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

    def test_user_generate_token_when_correct_login_credentials_are_provided(self):
        response = self.client().post('/api/v1/auth/register', data=self.user_data)
        self.assertEqual(response.status_code, 201)

        login_details = dict(email=self.user_data.get('email'), password=self.user_data.get('password'))
        auth_response = self.client().post('/api/v1/auth/login', data=login_details)

        self.assertIn('token', auth_response.data)
        self.assertEqual(auth_response.status_code, 200)

    def test_user_get_401_error_if_the_login_credentials_are_incorrect(self):
        response = self.client().post('/api/v1/auth/register', data=self.user_data)
        self.assertEqual(response.status_code, 201)

        login_details = dict(email='wrong@email.com', password='wrong_password')
        auth_response = self.client().post('/api/v1/auth/login', data=login_details)

        self.assertIn('Please provide valid login credentials.', auth_response.data)
        self.assertEqual(auth_response.status_code, 401)

