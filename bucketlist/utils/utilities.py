from flask import g
from flask_restful import abort

from bucketlist import auth
from bucketlist.models import User


@auth.verify_password
def validate(email_or_token, password):
    user = User.verify_token(email_or_token)
    if user is None:
        user = User.query.filter_by(email=email_or_token).first()
        if not user or not user.check_password(password):
            return abort(401, message='User does not exist.')
    g.user = user
    return True

