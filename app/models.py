from .extensions import db
from flask_login import UserMixin


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(500), nullable=False)
    card_sets = db.relationship('CardSet', backref='user', passive_deletes=True)
    saved_card_sets = db.relationship('CardSetSave', backref='user', passive_deletes=True)

    def __repr__(self):
        return f'<User "{self.username}">'
    
    
class CardSet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    saves = db.relationship('CardSetSave', backref='card_set', passive_deletes=True)
    cards = db.relationship('FlashCard', backref='card_set', passive_deletes=True)
    
    def __repr__(self):
        return f"<CardSet: {self.name}>"
    
    
class FlashCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(40), nullable=False)
    content = db.Column(db.String(300), nullable=False)
    cardset_id = db.Column(db.Integer, db.ForeignKey('card_set.id', ondelete="CASCADE"), nullable=False)
    images = db.relationship('CardImage', backref='flash_card', passive_deletes=True)
    audio = db.relationship('CardAudio', backref='flash_card', passive_deletes=True)

    def __repr__(self):
        return f"<FlashCard: {self.title}>"
    
    
class CardImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(50), nullable=False)
    side = db.Column(db.Integer, nullable=False)
    card_id = db.Column(db.Integer, db.ForeignKey('flash_card.id', ondelete="CASCADE"), nullable=False)
    
    def __repr__(self):
        return f"<CardImage: {self.id}>"
    
    
class CardAudio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(50), nullable=False)
    side = db.Column(db.Integer, nullable=False)
    card_id = db.Column(db.Integer, db.ForeignKey('flash_card.id', ondelete="CASCADE"), nullable=False)
    
    def __repr__(self):
        return f"<CardAudio: {self.id}>"    


class CardSetSave(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cardset_id = db.Column(db.Integer, db.ForeignKey('card_set.id', ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    cardset = db.relationship("CardSet", uselist=False, back_populates="card_set_save")
    def __repr__(self):
        return f"<CardSetSave: {self.id}>" 
    