import pytz
from flask import g

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer,
                          BadSignature, SignatureExpired)

from bucketlist import db
from bucketlist.config import Config

eat_timezone = pytz.timezone('Africa/Nairobi')


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    done = db.Column(db.Boolean, default=True)
    modified_at = db.Column(db.DateTime, default=datetime.now(eat_timezone), onupdate=datetime.now(eat_timezone))
    created_at = db.Column(db.DateTime, default=datetime.now(eat_timezone))
    bucketlist_id = db.Column(db.Integer, db.ForeignKey('bucketlist.id'), nullable=False)

    def __repr__(self):
        return '<Item %r>' % self.name()

    def __str__(self):
        return '{0}'.format(self.name())


class Bucketlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False, index=True)
    modified_at = db.Column(db.DateTime, default=datetime.now(eat_timezone), onupdate=datetime.now(eat_timezone))
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
    modified_at = db.Column(db.DateTime, default=datetime.now(eat_timezone), onupdate=datetime.now(eat_timezone))
    created_at = db.Column(db.DateTime, default=datetime.now(eat_timezone))
    bucketlists = db.relationship('Bucketlist', backref='user')

    @property
    def password(self):
        raise AttributeError('Password: write-only')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def validate(email, password):
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return False
        g.user = user
        return True

    @staticmethod
    def exists(email):
        return True if User.query.filter_by(email=email).first() else False

    def generate_token(self, expiration=600):
        s = Serializer(Config.SECRET_KEY, expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_token(token):
        s = Serializer(Config.SECRET_KEY)
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        user = User.query.get(data.get('id'))
        return user

    def name(self):
        return '{} {}'.format(self.last_name, self.first_name)

    @staticmethod
    def get_all():
        return User.query.all()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return '<User %r>' % self.name()

    def __str__(self):
        return '{0}'.format(self.name())

