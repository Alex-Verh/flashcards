from . import bp
from flask import render_template, redirect, url_for, request, jsonify
from flask_login import  login_required, current_user
from app.models import CardSet
from app.extensions import db


@bp.route('/cardset/<int:id>')
def cardset(id):
    cardset = CardSet.query.get_or_404(id)
    return render_template("cards/cardset.html", cardset=cardset)


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


@bp.route('/cardset/delete/<int:id>', methods=['POST'])
@login_required
def delete_cardset(id):
    cardset = CardSet.query.get(id)
    if not cardset:
        return jsonify({'error': 'Card set does not exist.'}, 400)
    
    if cardset.user_id == current_user.id:
        db.session.delete(cardset)
        db.session.commit()
    elif current_user in cardset.followers.all():
        cardset.followers.remove(current_user)
        db.session.commit()
    else:
        return jsonify({'error': 'Card set is not own or saved for this user'}, 400)

    return jsonify({'message': 'Card set has been deleted'})


@bp.route('/cardset/save/<int:id>', methods=['POST'])
@login_required
def save_cardset(id):
    cardset = CardSet.query.get(id)
    saved = current_user in cardset.followers.all()
    if not cardset:
        return jsonify({'error': 'Card set does not exist.'}, 400)
    elif saved:
        cardset.followers.remove(current_user)
        db.session.commit()
        saved = False
        img_url = url_for('static', filename='images/save2.png')
    else:
        cardset.followers.append(current_user)
        db.session.commit()
        saved = True
        img_url = url_for('static', filename='images/save1.png')

    return jsonify({"saves": cardset.followers.count(), "saved": saved, "image_url":img_url})
