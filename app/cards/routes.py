from . import bp
from flask import render_template, redirect, url_for, request, jsonify
from flask_login import  login_required, current_user
from app.models import CardSet
from app.extensions import db


@bp.route('/cardset/create', methods=['POST'])
@login_required
def create_cardset():
    cardset = CardSet(
        title=request.form.get('title'),
        is_public=int(request.form.get('is_public')),
        category_id=int(request.form.get('category')),
        user_id=current_user.id
        )
    db.session.add(cardset)
    db.session.commit()
    return redirect(url_for('main.home'))


@bp.route('/cardset/delete/<int:id>')
@login_required
def delete_cardset(id):
    cardset = CardSet.query.get_or_404(id)
    if cardset.user_id == current_user.id:
        db.session.delete(cardset)
    else:
        if current_user in cardset.followers.all():
            cardset.followers.remove(current_user)
        
    db.session.commit()

    return jsonify({'result':'success'})

@bp.route('/cardset/<int:id>')
def cardset(id):
    cardset = CardSet.query.get_or_404(id)
    return render_template("cards/cardset.html", cardset=cardset)