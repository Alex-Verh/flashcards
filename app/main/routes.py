from . import bp
from flask import render_template, request
from app.extensions import db
from app.models import User, CardSet, CardSetCategory, user_cardset_assn


@bp.route('/')
def index():
    return render_template('main/index.html')


@bp.route('/home', methods = ['GET'])
def home():
    search_query = request.args.get('search')
    if search_query:
        query = db.session.query(CardSet, db.func.count().label('total_saves'))\
            .join(user_cardset_assn)\
            .filter(CardSet.is_public).filter(CardSet.title.like('%' + search_query + '%'))\
            .group_by(CardSet.id).order_by(db.text('total_saves DESC'))

    else:
        query = db.session.query(CardSet, db.func.count().label('total_saves'))\
            .join(user_cardset_assn).filter(CardSet.is_public)\
            .group_by(CardSet.id).order_by(db.text('total_saves DESC')).limit(48)
    
    print(query)
    card_sets = [{'set': row[0], 'total_saves': row[1]} for row in query]
        
    return render_template('main/home.html', categories=CardSetCategory.query.all(), search_query=search_query, card_sets=card_sets)
