import pytz

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer)

from .. import db
from ..config import Config

eat_timezone = pytz.timezone('Africa/Nairobi')


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String)
    modified_at = db.Column(db.DateTime, default=datetime.now(eat_timezone), onupdate=datetime.now(eat_timezone))
    created_at = db.Column(db.DateTime, default=datetime.now(eat_timezone))
    bucketlists = db.relationship('Bucketlist', cascade="all,delete", backref='user')

    @property
    def password(self):
        raise AttributeError('Password: write-only')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def exists(self):
        return True if User.query.filter_by(email=self.email).first() else False

    def generate_token(self, expiration=Config.TOKEN_EXPIRATION):
        s = Serializer(Config.SECRET_KEY, expires_in=int(expiration))
        return s.dumps({'id': self.id})

    def name(self):
        return '{} {}'.format(self.last_name, self.first_name)

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

