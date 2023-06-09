from flask_login import  login_required

from . import bp

from .service import ApiCards

@bp.route('/cardset/<int:id>')
def cardset(id):
    return ApiCards.get_cardset(id)

@bp.route('/learn/', defaults={'id': None})
@bp.route('/learn/<int:id>')
def learn(id):
    return ApiCards.learn(id)

@bp.route('/cardset/create', methods=['POST'])
@login_required
def create_cardset():
    return ApiCards.create_cardset()