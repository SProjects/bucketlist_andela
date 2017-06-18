from tests.base_test_case import BaseTestCase


class TestAuthenticateUser(BaseTestCase):
    def setUp(self):
        super(TestAuthenticateUser, self).setUp()
        self.add_user()

    def test_user_generate_token_when_correct_login_credentials_are_provided(self):
        login_details = dict(email=self.user_data.get('email'), password=self.user_data.get('password'))
        auth_response = self.client().post('/api/v1/auth/login', data=login_details)

        self.assertIn('token', auth_response.data)
        self.assertEqual(auth_response.status_code, 200)

    def test_user_get_401_error_if_the_login_credentials_are_incorrect(self):
        login_details = dict(email='wrong@email.com', password='wrong_password')
        auth_response = self.client().post('/api/v1/auth/login', data=login_details)

        self.assertIn('Please provide valid login credentials.', auth_response.data)
        self.assertEqual(auth_response.status_code, 401)

