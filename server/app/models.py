from flask_login import UserMixin
from sqlalchemy import func

from .database import view
from .extensions import db

user_cardset_assn = db.Table(
    "user_cardset_assn",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column(
        "cardset_id", db.Integer, db.ForeignKey("card_sets.id"), primary_key=True
    ),
)


class User(db.Model, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())

    own_cardsets = db.relationship(
        "CardSet", backref="author", passive_deletes=True, lazy="dynamic"
    )
    saved_cardsets = db.relationship(
        "CardSet",
        secondary=user_cardset_assn,
        back_populates="followers",
        lazy="dynamic",
    )

    @property
    def flashcards_number(self):
        return self.own_cardsets.join(FlashCard).count()

    def __repr__(self):
        return f"User({self.id}, '{self.username}')"


class CardSet(db.Model):
    __tablename__ = "card_sets"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    is_public = db.Column(db.Boolean, nullable=False)
    category_id = db.Column(
        db.Integer,
        db.ForeignKey("card_set_categories.id", ondelete="SET DEFAULT"),
        default=21,
    )
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())

    category = db.relationship("CardSetCategory", lazy="select")
    flash_cards = db.relationship(
        "FlashCard", backref="card_set", passive_deletes=True, lazy="dynamic"
    )
    followers = db.relationship(
        "User",
        secondary=user_cardset_assn,
        back_populates="saved_cardsets",
        lazy="dynamic",
    )

    def __repr__(self):
        return f"CardSet({self.id}, '{self.title}')"


class FlashCard(db.Model):
    __tablename__ = "flash_cards"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    content = db.Column(db.String(320), nullable=False)
    attachments = db.Column(db.JSON, nullable=False)
    cardset_id = db.Column(
        db.Integer, db.ForeignKey("card_sets.id", ondelete="CASCADE"), nullable=False
    )
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())

    def __repr__(self):
        return f"FlashCard({self.id}, '{self.title}')"


class CardSetCategory(db.Model):
    __tablename__ = "card_set_categories"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(25), nullable=False)

    def __repr__(self):
        return f"CardSetCategory({self.id}, '{self.title}')>"


cardsets_view = view(
    "card_sets_view",
    db.metadata,
    db.select(
        CardSet.id.label("id"),
        CardSet.title.label("title"),
        CardSet.category_id.label("category_id"),
        CardSetCategory.title.label("category_title"),
        CardSet.user_id.label("author_id"),
        User.username.label("author_username"),
        db.func.count(db.func.distinct(user_cardset_assn.c.user_id)).label(
            "total_saves"
        ),
        db.func.count(db.func.distinct(FlashCard.id)).label("flashcards_qty"),
        CardSet.created_at.label("created_at"),
        CardSet.is_public.label("is_public"),
    )
    .select_from(CardSet)
    .outerjoin(user_cardset_assn)
    .outerjoin(FlashCard)
    .join(CardSetCategory, CardSet.category_id == CardSetCategory.id)
    .join(User, CardSet.user_id == User.id)
    .group_by(CardSet.id, CardSetCategory.title, User.username),
)
