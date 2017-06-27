import json

from tests.base_test_case import BaseTestCase


class TestRegisterUser(BaseTestCase):
    def setUp(self):
        super(TestRegisterUser, self).setUp()

    def test_user_registration(self):
        response = self.client().post('/api/v1/auth/register', data=json.dumps(self.user_data))
        result = json.loads(response.data)

        self.assertEqual(result['message'], 'You registered successfully.')

    def test_already_registered_user(self):
        self.add_user()
        response = self.client().post('/api/v1/auth/register', data=json.dumps(self.user_data))
        result = json.loads(response.data)

        self.assertEqual(response.status_code, 409)
        self.assertEqual(result['message'], 'User already exists. Login.')

    def test_user_registration_fails_with_401_error_is_password_and_password_confirmation_values_do_not_match(self):
        user_data = {'first_name': 'First', 'last_name': 'Last', 'email': 'first@email.com',
                     'password': 'test_password', 'password_confirm': 'different_test_password'}

        response = self.client().post('/api/v1/auth/register', data=json.dumps(user_data))
        result = json.loads(response.data)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(result['message'], 'Password and confirmation password don\'t match')
