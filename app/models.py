from .extensions import db
from flask_login import UserMixin
from sqlalchemy.sql import func


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    
    card_sets = db.relationship('CardSet', backref='user', passive_deletes=True)
    saved_card_sets = db.relationship('CardSetSave', backref='user', passive_deletes=True)

    def __repr__(self):
        return f'<User "{self.username}">'
    
    
class CardSet(db.Model):
    __tablename__ = 'card_sets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    is_public = db.Column(db.Boolean, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('card_set_categories.id', ondelete="SET DEFAULT"), default=21)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    
    cards = db.relationship('FlashCard', backref='card_set', passive_deletes=True)
    saves = db.relationship('CardSetSave', backref='card_set', passive_deletes=True)
    
    def __repr__(self):
        return f"<CardSet: {self.name}>"
    
    
class FlashCard(db.Model):
    __tablename__ = 'flash_cards'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(40), nullable=False)
    content = db.Column(db.String(300), nullable=False)
    attachments = db.Column(db.JSON, nullable=False)
    cardset_id = db.Column(db.Integer, db.ForeignKey('card_sets.id', ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    
    def __repr__(self):
        return f"<FlashCard: {self.title}>"
    

class CardSetSave(db.Model):
    __tablename__ = 'card_set_saves'
    cardset_id = db.Column(db.Integer, db.ForeignKey('card_sets.id', ondelete="CASCADE"), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), primary_key=True)
    
    def __repr__(self):
        return f"<CardSetSave: {self.cardset_id} - {self.user_id}>" 
    

class CardSetCategory(db.Model):
    __tablename__ = 'card_set_categories'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(25), nullable=False)
    
    def __repr__(self):
        return f"<CardSetCategory: {self.title}>"
    