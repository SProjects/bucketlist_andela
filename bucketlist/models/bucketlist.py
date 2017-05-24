import pytz

from datetime import datetime

from .. import db

eat_timezone = pytz.timezone('Africa/Nairobi')


class Bucketlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False, index=True)
    modified_at = db.Column(db.DateTime, default=datetime.now(eat_timezone), onupdate=datetime.now(eat_timezone))
    created_at = db.Column(db.DateTime, default=datetime.now(eat_timezone))
    items = db.relationship('Item', cascade="all,delete", backref='bucketlist')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return '<Bucketlist %r>' % self.name

    def __str__(self):
        return '{0}'.format(self.name)