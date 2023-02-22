from . import bp
from flask import render_template, flash, redirect, url_for
from flask_login import  login_required, current_user
from app.extensions import db
from app.models import CardSet


@bp.route('/cardset/delete/<int:id>', methods=['GET', 'POST'])
@login_required
def delete_cardset(id):
    cardset = CardSet.query.get_or_404(id)
    return
            
    