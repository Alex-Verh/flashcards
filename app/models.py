from .extensions import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=True)
    username = db.Column(db.String(50), unique=True, nullable=True)
    password = db.Column(db.String(500), nullable=True)

    def __repr__(self):
        return f'<User "{self.username}">'
    
class FlashCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(40), nullable=True)
    content = db.Column(db.String(300), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return f"<FlashCard: {self.title}>"