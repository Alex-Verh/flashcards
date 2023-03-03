from . import bp
from flask import render_template, redirect, url_for, request
from flask_login import  login_required, current_user
from ..models import CardSet
from ..extensions import db


@bp.route('/cardset/<int:id>')
def cardset(id):
    cardset = CardSet.query.get_or_404(id)
    return render_template("cards/cardset.html", cardset=cardset)


@bp.route('/cardset/create', methods=['POST'])
@login_required
def create_cardset():
    print(request.form)
    cardset = CardSet(
        title=request.form.get('title'),
        is_public=int(request.form.get('is_public')),
        category_id=int(request.form.get('category')),
        user_id=current_user.id
        )
    db.session.add(cardset)
    db.session.commit()
    return redirect(url_for('main.home'))
