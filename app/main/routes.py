from . import bp
from flask import render_template
from flask_login import login_required, current_user
from app.extensions import db
from app.models import FlashCard

@bp.route('/')
def index():
    return render_template('main/index.html')


@bp.route('/home')
def home():
    return render_template('main/home.html')

@bp.route('/profile')
@login_required
def profile():
    user_cards = FlashCard.query.filter_by(user_id=current_user.get_id()).all()
    user_cards_len = len(user_cards)
    return render_template('main/profile.html', user_cards=user_cards, user_cards_len=user_cards_lenfavi)