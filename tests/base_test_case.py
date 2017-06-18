import base64

from flask_testing import TestCase
from unittest import TestCase as UnitTestCase

import bucketlist
from bucketlist.models.bucketlist import Bucketlist
from bucketlist.models.item import Item
from bucketlist.models.user import User


class BaseTestCase(TestCase, UnitTestCase):
    def create_app(self):
        return bucketlist.create_app('testing')

    def setUp(self):
        super(BaseTestCase, self).setUp()
        self.app = self.create_app()
        self.client = self.app.test_client

        self.user_data = {'first_name': 'First', 'last_name': 'Last', 'email': 'first@email.com',
                          'password': 'test_password', 'password_confirm': 'test_password'}

        self.second_user_data = {'first_name': 'First2', 'last_name': 'Last2',
                                 'email': 'first2@email.com', 'password': 'test_password',
                                 'password_confirm': 'test_password'}

        with self.app.app_context():
            bucketlist.db.session.close()
            bucketlist.db.drop_all()
            bucketlist.db.create_all()

    def add_user(self):
        user = User(first_name=self.user_data.get('first_name'), last_name=self.user_data.get('last_name'),
                    email=self.user_data.get('email'), password=self.user_data.get('password'))
        user.save()

    def add_second_user(self):
        user = User(first_name=self.second_user_data.get('first_name'),
                    last_name=self.second_user_data.get('last_name'),
                    email=self.second_user_data.get('email'),
                    password=self.second_user_data.get('password'))
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

    def authorization_headers(self, email='first@email.com', password='test_password'):
        login_credentials = '{}:{}'.format(email, password)
        return {'Authorization': 'Basic ' + base64.b64encode(login_credentials)}

    def tearDown(self):
        super(BaseTestCase, self).tearDown()
        bucketlist.db.session.remove()
        bucketlist.db.drop_all()

