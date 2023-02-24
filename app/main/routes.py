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
        card_sets.sort(key=lambda obj: obj.saves_number, reverse=True)

    else:
        card_sets = CardSet.query.filter_by(is_public=True).all()
        card_sets.sort(key=lambda obj: obj.saves_number, reverse=True)
        card_sets = card_sets[:28]

    return render_template('main/home.html', categories=CardSetCategory.query.all(), search_query=search_query, card_sets=card_sets)
