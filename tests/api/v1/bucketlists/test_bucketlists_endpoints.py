import json
import base64

from bucketlist.models.bucketlist import Bucketlist
from bucketlist.models.user import User
from tests.base_test_case import BaseTestCase


class TestBucketListEndpoints(BaseTestCase):
    def token_headers(self, token):
        login_credentials = '{}:{}'.format(token, 'unused_password')
        return {'Authorization': 'Basic ' + base64.b64encode(login_credentials)}

    def setUp(self):
        super(TestBucketListEndpoints, self).setUp()
        self.bucketlist_data = {'name': 'Bucket List Name'}

    def test_post_adds_new_bucketlist(self):
        self.client().post('/api/v1/auth/register', data=self.user_data)
        login_credentials = dict(email=self.user_data.get('email'),
                                 password=self.user_data.get('password'))
        response = self.client().post('/api/v1/auth/login', data=login_credentials)
        result = json.loads(response.data.decode())
        token = result['token']

        response = self.client().post('/api/v1/bucketlists', data=self.bucketlist_data,
                                      headers=self.token_headers(token))
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Bucketlist.query.all()), 1)
        self.assertEqual(result['message'], 'Bucketlist created successfully.')

    def test_get_returns_all_bucketlists_for_user(self):
        self.add_user()
        self.add_bucketlists()
        response = self.client().get('/api/v1/bucketlists', headers=self.authorization_headers())
        result = json.loads(response.data.decode()).get('results')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(result), 2)

    def test_get_returns_one_bucketlist_if_id_is_specified(self):
        self.add_user()
        self.add_bucketlists()
        response = self.client().get('/api/v1/bucketlists/1', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        expected_list = sorted(['id', 'name', 'items', 'date_created', 'date_modified', 'created_by'])
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(sorted([str(key) for key in result.keys()]), expected_list)
        self.assertListEqual([result.get('name'), result.get('created_by')], ['Bucketlist One', 1])

    def test_edit_updates_bucketlist_fields(self):
        self.add_user()
        self.add_bucketlists()
        response = self.client().get('/api/v1/bucketlists/1', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(result.get('name'), 'Bucketlist One')

        update_fields = {'name': 'Visit Bali'}
        response = self.client().put('/api/v1/bucketlists/1', data=update_fields,
                                     headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(result.get('name'), update_fields.get('name'))

    def test_edit_fails_to_update_bucketlist_if_it_does_not_belong_to_the_user(self):
        self.add_user()
        self.add_bucketlists()

        other_user = User(first_name='Other', last_name='User', email='other@email.com', password='password')
        other_user.save()

        login_credentials = '{}:{}'.format('other@email.com', 'password')
        other_user_auth = {'Authorization': 'Basic ' + base64.b64encode(login_credentials)}

        update_fields = {'name': 'Visit Bali'}
        response = self.client().put('/api/v1/bucketlists/1', data=update_fields,
                                     headers=other_user_auth)
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 400)
        self.assertEqual(result.get('message'), 'Bucketlist with ID#1 not found or not yours.')

    def test_delete_removes_bucketlist_from_database(self):
        self.add_user()
        self.add_bucketlists()

        self.assertEqual(len(Bucketlist.query.all()), 2)

        response = self.client().delete('/api/v1/bucketlists/1',
                                        headers=self.authorization_headers())
        result = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(result.get('message'), 'Bucketlist with ID#1 successfully deleted.')
        self.assertEqual(len(Bucketlist.query.all()), 1)

    def test_delete_fails_with_400_error_if_bucketlist_does_not_belong_to_the_user(self):
        self.add_user()
        self.add_bucketlists()

        self.assertEqual(len(Bucketlist.query.all()), 2)

        other_user = User(first_name='Other', last_name='User', email='other@email.com', password='password')
        other_user.save()

        login_credentials = '{}:{}'.format('other@email.com', 'password')
        other_user_auth = {'Authorization': 'Basic ' + base64.b64encode(login_credentials)}

        response = self.client().delete('/api/v1/bucketlists/1',
                                        headers=other_user_auth)
        result = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 400)
        self.assertEqual(result.get('message'), 'Bucketlist with ID#1 not found or not yours.')
        self.assertEqual(len(Bucketlist.query.all()), 2)

    def test_search_returns_bucketlists_whose_name_matches_a_search_term(self):
        self.add_user()
        self.add_bucketlists()

        response = self.client().get('/api/v1/bucketlists?q=Bucketlist',
                                     headers=self.authorization_headers())
        result = json.loads(response.data.decode()).get('results')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(result), 2)

        response = self.client().get('/api/v1/bucketlists?q=One', headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(result), 1)

    def test_pagination_of_bucketlists_when_you_pass_a_limit_parameter(self):
        self.add_user()
        self.add_bucketlists()

        response = self.client().get('/api/v1/bucketlists?limit=1',
                                     headers=self.authorization_headers())
        result = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        expected_result = sorted(['results', 'next', 'total_pages', 'page', 'num_results'])
        self.assertListEqual(sorted(result.keys()), expected_result)
        self.assertEqual(len(result.get('results')), 1)
