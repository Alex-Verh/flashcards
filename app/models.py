from .extensions import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(500), nullable=False)
    card_sets = db.relationship('CardSet', backref='user', lazy=True)

    def __repr__(self):
        return f'<User "{self.username}">'
    
class CardSet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    cards = db.relationship('FlashCard', backref='card_set', lazy=True)
    
    def __repr__(self):
        return f"<CardSet: {self.name}>"
    
class FlashCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(40), nullable=False)
    content = db.Column(db.String(300), nullable=False)
    cardset_id = db.Column(db.Integer, db.ForeignKey('card_set.id'))
    images = db.relationship('CardImage', backref='flash_card', lazy=True)
    audio = db.relationship('CardAudio', backref='flash_card', lazy=True)

    def __repr__(self):
        return f"<FlashCard: {self.title}>"
    
class CardImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(50), nullable=False)
    side = db.Column(db.Integer, nullable=False)
    card_id = db.Column(db.Integer, db.ForeignKey('flash_card.id'))
    
    def __repr__(self):
        return f"<CardImage: {self.id}>"
    
class CardAudio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(50), nullable=False)
    side = db.Column(db.Integer, nullable=False)
    card_id = db.Column(db.Integer, db.ForeignKey('flash_card.id'))
    
    def __repr__(self):
        return f"<CardAudio: {self.id}>"    