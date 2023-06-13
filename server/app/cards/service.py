from flask import abort, redirect, render_template, request, url_for
from flask_login import current_user

from ..extensions import db
from ..models import CardSet


class CardsService:
    @classmethod
    def get_cardset(cls, id):
        cardset = CardSet.query.get_or_404(id)

        if (not cardset.is_public) and current_user != cardset.author:
            abort(403)
        return render_template("set.html", cardset=cardset)

    @classmethod
    def learn(cls, id):
        if id:
            cardset = CardSet.query.get_or_404(id)
        else:
            cardset = None
        return render_template("cards/learn.html", cardset=cardset)
