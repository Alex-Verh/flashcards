from .extensions import db
from flask_login import UserMixin
from sqlalchemy.sql import func


user_cardset_assn = db.Table('user_cardset_assn',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('cardset_id', db.Integer, db.ForeignKey('card_sets.id'), primary_key=True))


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    
    own_card_sets = db.relationship('CardSet', backref='author', passive_deletes=True, lazy=True)
    saved_card_sets = db.relationship('CardSet', secondary=user_cardset_assn, back_populates='followers', lazy=True)

    @property
    def flashcards_amount(self):
        amount = 0
        for cardset in self.own_card_sets:
            amount += len(cardset.flash_cards)
        return amount
    
    def __repr__(self):
        return f"User({self.id}, '{self.name}', '{self.username}')"
    
    
class CardSet(db.Model):
    __tablename__ = 'card_sets'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    is_public = db.Column(db.Boolean, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('card_set_categories.id', ondelete="SET DEFAULT"), default=21)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    
    flash_cards = db.relationship('FlashCard', backref='card_set', passive_deletes=True, lazy=True)
    followers = db.relationship('User', secondary=user_cardset_assn, back_populates='saved_card_sets', lazy=True)
    
    def __repr__(self):
        return f"CardSet({self.id}, '{self.title}')"
    
    
class FlashCard(db.Model):
    __tablename__ = 'flash_cards'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.String(300), nullable=False)
    attachments = db.Column(db.JSON, nullable=False)
    cardset_id = db.Column(db.Integer, db.ForeignKey('card_sets.id', ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    
    def __repr__(self):
        return f"FlashCard({self.id}, '{self.title}')"
    

class CardSetCategory(db.Model):
    __tablename__ = 'card_set_categories'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(25), nullable=False)
    
    def __repr__(self):
        return f"CardSetCategory({self.id}, '{self.title}')>"
    