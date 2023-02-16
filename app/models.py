from .extensions import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=True)
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(500), nullable=True)

    def __repr__(self):
        return f'<User "{self.username}">'