import pytz

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from bucketlist import db

eat_timezone = pytz.timezone('Africa/Nairobi')


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    done = db.Column(db.Boolean, default=True)
    modified_at = db.Column(db.DateTime, default=datetime.now(eat_timezone))
    created_at = db.Column(db.DateTime, default=datetime.now(eat_timezone))
    bucketlist_id = db.Column(db.Integer, db.ForeignKey('bucketlist.id'), nullable=False)

    def __repr__(self):
        return '<Item %r>' % self.name()

    def __str__(self):
        return '{0}'.format(self.name())


class Bucketlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False, index=True)
    modified_at = db.Column(db.DateTime, default=datetime.now(eat_timezone))
    created_at = db.Column(db.DateTime, default=datetime.now(eat_timezone))
    items = db.relationship('Item', backref='bucketlist')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return '<Bucketlist %r>' % self.name()

    def __str__(self):
        return '{0}'.format(self.name())


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String)
    modified_at = db.Column(db.DateTime, default=datetime.now(eat_timezone))
    created_at = db.Column(db.DateTime, default=datetime.now(eat_timezone))
    bucketlists = db.relationship('Bucketlist', backref='user')

    @property
    def password(self):
        raise AttributeError('Password: write-only')

    @password.setter
    def password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def _name(self):
        return '{} {}'.format(self.last_name, self.first_name)

    def __repr__(self):
        return '<User %r>' % self._name()

    def __str__(self):
        return '{0}'.format(self._name())

