from flask import g
from flask_restful import abort

from itsdangerous import (JSONWebSignatureSerializer as Serializer,
                          BadSignature, SignatureExpired)

from bucketlist import auth
from bucketlist.models.user import User
from bucketlist.config import Config


@auth.verify_password
def validate(email_or_token, password):
    user = verify_token(email_or_token)
    if user is None:
        user = User.query.filter_by(email=email_or_token).first()
        if not user or not user.check_password(password):
            return abort(401, message='Please provide valid login credentials.')
    g.user = user
    return True


def verify_token(token):
    serializer = Serializer(Config.SECRET_KEY)
    try:
        data = serializer.loads(token)
    except SignatureExpired:
        return None
    except BadSignature:
        return None
    user = User.query.get(data.get('id'))
    return user

