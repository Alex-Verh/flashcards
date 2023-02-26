from . import bp
from flask import render_template, request
from app.extensions import db
from app.models import User, CardSet, CardSetCategory, user_cardset_assn
from app.funcs import get_most_popular_cardsets, get_cardset_search_results


@bp.route('/')
def index():
    return render_template('main/index.html')


@bp.route('/home', methods = ['GET'])
def home():
    search_query = request.args.get('q')
    sort_by = request.args.get('sort_by')
    sort_order = request.args.get('sort_order')
    if search_query:
        card_sets = get_cardset_search_results(search_query, sort_by=sort_by, sort_order=sort_order)
    else:
        card_sets = get_most_popular_cardsets()
        
    return render_template('main/home.html', categories=CardSetCategory.query.all(), search_query=search_query, card_sets=card_sets)
