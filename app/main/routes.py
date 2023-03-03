from . import bp
from flask import render_template, request
from ..extensions import db
from ..models import User, CardSet, CardSetCategory, user_cardset_assn
from ..funcs import get_most_popular_cardsets, get_cardset_search_results


@bp.route('/')
def index():
    return render_template('main/index.html')


@bp.route('/home', methods = ['GET'])
def home():
    return render_template('main/home.html', categories=CardSetCategory.query.all())
