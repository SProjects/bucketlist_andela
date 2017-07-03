import json

from bucketlist.models.user import User
from tests.base_test_case import BaseTestCase


class TestUsersEndpoint(BaseTestCase):
    def setUp(self):
        super(TestUsersEndpoint, self).setUp()

    def test_returns_all_users(self):
        self.add_user()
        response = self.client().get('/api/v1/users', headers=self.authorization_headers())
        result = json.loads(response.data).get('results')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(result), 1)

    def test_returns_401_error_if_there_are_no_users(self):
        response = self.client().get('/api/v1/users', headers=self.authorization_headers())
        result = json.loads(response.data)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(result['message'], 'Please provide valid login credentials.')

    def test_return_a_single_user_if_id_is_provided(self):
        self.add_user()
        response = self.client().get('/api/v1/users/1', headers=self.authorization_headers())
        result = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertListEqual(result.keys(), ['bucketlists_url', 'first_name', 'last_name', 'id', 'email'])

    def test_fails_with_401_error_if_there_is_no_user_with_provided_id(self):
        self.add_user()
        response = self.client().get('/api/v1/users/20', headers=self.authorization_headers())
        result = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(result['message'], 'User with id#20 not found.')

    def test_return_a_single_user_using_a_token(self):
        self.add_user()
        login_details = dict(email='first@email.com', password='test_password')
        auth_response = self.client().post('/api/v1/auth/login', data=json.dumps(login_details))
        auth_token = json.loads(auth_response.data.decode()).get('token')

        token_auth_header = self.authorization_headers(auth_token, 'test_password')

        response = self.client().get('/api/v1/users/1?token=true', headers=token_auth_header)
        result = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        actual = [result.get('first_name'), result.get('last_name'), result.get('email')]
        expected = ['First', 'Last', 'first@email.com']

        self.assertListEqual(actual, expected)

    def test_delete_endpoint_deletes_a_user_using_a_users_id(self):
        self.add_user(), self.add_second_user()
        self.assertEqual(len(User.query.all()), 2)

        response = self.client().delete('/api/v1/users/1', headers=self.authorization_headers())
        result = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(result['message'], 'User with id#1 successfully deleted.')
        self.assertEqual(len(User.query.all()), 1)

    def test_delete_endpoint_fails_with_401_error_if_there_is_no_user_with_the_provided_id(self):
        self.add_user()
        response = self.client().get('/api/v1/users/20', headers=self.authorization_headers())
        result = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(result['message'], 'User with id#20 not found.')

    def test_edit_updates_a_user_object(self):
        self.add_user()
        response = self.client().get('/api/v1/users/1', headers=self.authorization_headers())
        user = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertListEqual([user.get('first_name'), user.get('last_name'), user.get('email')],
                             ['First', 'Last', 'first@email.com'])

        update_fields = dict(first_name='Updated First', last_name='Updated Last', email=user.get('email'))
        response = self.client().put('/api/v1/users/1', data=json.dumps(update_fields),
                                     headers=self.authorization_headers())
        updated_user = json.loads(response.data)

        expected_result = [update_fields.get('first_name'), update_fields.get('last_name'),
                           update_fields.get('email')]
        actual_result = [updated_user.get('first_name'), updated_user.get('last_name'),
                         updated_user.get('email')]

        self.assertListEqual(actual_result, expected_result)

    def test_user_can_update_password(self):
        self.add_user()
        update_fields = dict(old_password='test_password', password='new_password',
                             password_confirm='new_password')
        response = self.client().put('/api/v1/users/1', data=json.dumps(update_fields),
                                     headers=self.authorization_headers())
        updated_user = User.query.get(1)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(updated_user.check_password(update_fields.get('password')))
        self.assertFalse(updated_user.check_password(update_fields.get('old_password')))

    def test_password_update_does_not_occur_if_any_password_update_fields_is_missing(self):
        self.add_user()
        update_fields = dict(old_password='test_password', password='new_password')
        response = self.client().put('/api/v1/users/1', data=json.dumps(update_fields),
                                     headers=self.authorization_headers())
        updated_user = User.query.get(1)

        self.assertEqual(response.status_code, 200)
        self.assertFalse(updated_user.check_password(update_fields.get('password')))
        self.assertTrue(updated_user.check_password(update_fields.get('old_password')))

    def test_password_update_fails_with_400_if_old_password_is_incorrect(self):
        self.add_user()
        update_fields = dict(old_password='wrong_old_password', password='new_password',
                             password_confirm='new_password')
        response = self.client().put('/api/v1/users/1', data=json.dumps(update_fields),
                                     headers=self.authorization_headers())
        result = json.loads(response.data)
        updated_user = User.query.get(1)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(result.get('message'),
                         "Failed to update user -> Incorrect old password.")
        self.assertFalse(updated_user.check_password(update_fields.get('password')))
        self.assertTrue(updated_user.check_password('test_password'))

    def test_password_update_fails_with_400_if_new_password_fields_dont_match(self):
        self.add_user()
        update_fields = dict(old_password='test_password', password='new_password',
                             password_confirm='none_matching_password')
        response = self.client().put('/api/v1/users/1', data=json.dumps(update_fields),
                                     headers=self.authorization_headers())
        result = json.loads(response.data)
        updated_user = User.query.get(1)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(result.get('message'),
                         "Failed to update user -> New passwords don't match.")
        self.assertFalse(updated_user.check_password(update_fields.get('password')))
        self.assertTrue(updated_user.check_password('test_password'))
