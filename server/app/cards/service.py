from flask import render_template, redirect, url_for, request, abort
from flask_login import current_user

from ..models import CardSet
from ..extensions import db


class ApiCards:

    @classmethod
    def get_cardset(cls, id):
        cardset = CardSet.query.get_or_404(id)
    
        if (not cardset.is_public) and current_user != cardset.author:
            abort(403)
        return render_template("cards/cardset.html", cardset=cardset)
    
    @classmethod 
    def learn(cls, id):
        if id: 
            cardset = CardSet.query.get_or_404(id)
        else:
            cardset = None
        return render_template('cards/learn.html', cardset=cardset)
    
    @classmethod
    def create_cardset():
        cardset = CardSet(
        title=request.form.get('title'),
        is_public=request.form.get('is_public', default=0, type=int),
        category_id=request.form.get('category', default=21, type=int),
        user_id=current_user.id
        )
        db.session.add(cardset)
        db.session.commit()
        
        return redirect(url_for('cards.cardset', id=cardset.id))
