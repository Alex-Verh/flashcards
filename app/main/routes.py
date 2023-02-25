from . import bp
from flask import render_template, request
from sqlalchemy.sql import func, text
from app.extensions import db
from app.models import CardSetCategory, CardSet, user_cardset_assn


@bp.route('/')
def index():
    return render_template('main/index.html')


@bp.route('/home', methods = ['GET'])
def home():
    search_query = request.args.get('search')
    if search_query:
        card_sets_query = db.session.query(CardSet.id, CardSet.title, func.count(user_cardset_assn.cardset_id).label('total_saves')).join(user_cardset_assn).filter(CardSet.title.like('%' + search_query + '%')).filter(CardSet.is_public).group_by(user_cardset_assn.user_id).order_by(text('total_saves DESC'))
        print(card_sets_query)
        card_sets = card_sets_query.all()

    else:
        card_sets_query = db.session.query(CardSet.id, CardSet.title, func.count(user_cardset_assn.cardset_id).label('total_saves')).join(user_cardset_assn).filter(CardSet.is_public).group_by(user_cardset_assn.cardset_id).order_by(text('total_saves DESC')).limit(48)
        print(card_sets_query)
        card_sets = card_sets_query.all()
    return render_template('main/home.html', categories=CardSetCategory.query.all(), search_query=search_query, card_sets=card_sets)
