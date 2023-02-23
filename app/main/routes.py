from . import bp
from flask import render_template, request
from sqlalchemy.sql import func
from app.extensions import db
from app.models import CardSetCategory, CardSet, CardSetSave


@bp.route('/')
def index():
    return render_template('main/index.html')


@bp.route('/home', methods = ['GET'])
def home():
    search_query = request.args.get('search')
    if search_query:
        card_sets = CardSet.query.filter(CardSet.title.like('%' + search_query + '%')).filter(CardSet.is_public).all()
        card_sets = [(i, len(i.saves)) for i in card_sets]
    else:
        # card_sets = CardSet.query.filter(CardSet.is_public).order_by(CardSet.saves_number).limit(15).all()
        card_sets = db.session.query(CardSet, func.count(CardSetSave.user_id).label('save_count')).\
        join(CardSetSave).group_by(CardSet).order_by(func.count(CardSetSave.user_id).desc()).limit(15).all()
    print(card_sets)
    return render_template('main/home.html', categories=CardSetCategory.query.all(), search_query=search_query, card_sets=card_sets)
