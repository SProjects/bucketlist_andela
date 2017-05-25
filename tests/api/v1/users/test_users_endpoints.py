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
        response = self.client().get('/api/v1/users', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(result), 2)

    def test_returns_empty_list_if_there_are_no_users(self):
        response = self.client().get('/api/v1/users', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 401)
        self.assertEqual(result['message'], 'Please provide valid login credentials.')

    def test_return_a_single_user_if_id_is_provided(self):
        self.add_users()
        response = self.client().get('/api/v1/users/1', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertListEqual(result.keys(), ['bucketlists_url', 'first_name', 'last_name', 'id', 'email'])

    def test_fails_with_401_error_if_there_is_no_user_with_provided_id(self):
        self.add_users()
        response = self.client().get('/api/v1/users/20', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 400)
        self.assertEqual(result['message'], 'User with id#20 not found.')

    def test_delete_endpoint_deletes_a_user_using_a_users_id(self):
        self.add_users()
        self.assertEqual(len(User.query.all()), 2)

        response = self.client().delete('/api/v1/users/1', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(result['message'], 'User with id#1 successfully deleted.')
        self.assertEqual(len(User.query.all()), 1)

    def test_delete_endpoint_fails_with_401_error_if_there_is_no_user_with_the_provided_id(self):
        self.add_users()
        response = self.client().get('/api/v1/users/20', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 400)
        self.assertEqual(result['message'], 'User with id#20 not found.')

    def test_edit_updates_a_user_object(self):
        self.add_users()
        response = self.client().get('/api/v1/users/1', headers=self.authorization_headers())
        user = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertListEqual([user.get('first_name'), user.get('last_name'), user.get('email')],
                             ['First1', 'Last1', 'first1@email.com'])

        update_fields = dict(first_name='Updated First1', last_name='Updated Last1', email=user.get('email'))
        response = self.client().put('/api/v1/users/1', data=update_fields,
                                     headers=self.authorization_headers())
        updated_user = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        expected_result = [update_fields.get('first_name'), update_fields.get('last_name'),
                           update_fields.get('email')]
        actual_result = [updated_user.get('first_name'), updated_user.get('last_name'), updated_user.get('email')]
        self.assertListEqual(actual_result, expected_result)

    def test_user_can_update_password(self):
        self.add_users()
        update_fields = dict(old_password='test_password', new_password='new_password',
                             new_password_confirm='new_password')
        response = self.client().put('/api/v1/users/1', data=update_fields,
                                     headers=self.authorization_headers())
        updated_user = User.query.get(1)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(updated_user.check_password(update_fields.get('new_password')))
        self.assertFalse(updated_user.check_password(update_fields.get('old_password')))

    def test_password_update_does_not_occur_if_any_password_update_fields_is_missing(self):
        self.add_users()
        update_fields = dict(old_password='test_password', new_password='new_password')
        response = self.client().put('/api/v1/users/1', data=update_fields,
                                     headers=self.authorization_headers())
        updated_user = User.query.get(1)

        self.assertEqual(response.status_code, 200)
        self.assertFalse(updated_user.check_password(update_fields.get('new_password')))
        self.assertTrue(updated_user.check_password(update_fields.get('old_password')))

    def test_password_update_fails_with_401_if_old_password_is_incorrect(self):
        self.add_users()
        update_fields = dict(old_password='wrong_old_password', new_password='new_password',
                             new_password_confirm='new_password')
        response = self.client().put('/api/v1/users/1', data=update_fields,
                                     headers=self.authorization_headers())
        result = json.loads(response.data.decode())
        updated_user = User.query.get(1)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(result.get('message'),
                         "Failed to update user -> Incorrect old password or new passwords don't match.")
        self.assertFalse(updated_user.check_password(update_fields.get('new_password')))
        self.assertTrue(updated_user.check_password('test_password'))

    def test_password_update_fails_with_401_if_new_password_fields_dont_match(self):
        self.add_users()
        update_fields = dict(old_password='test_password', new_password='new_password',
                             new_password_confirm='none_matching_password')
        response = self.client().put('/api/v1/users/1', data=update_fields,
                                     headers=self.authorization_headers())
        result = json.loads(response.data.decode())
        updated_user = User.query.get(1)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(result.get('message'),
                         "Failed to update user -> Incorrect old password or new passwords don't match.")
        self.assertFalse(updated_user.check_password(update_fields.get('new_password')))
        self.assertTrue(updated_user.check_password('test_password'))
