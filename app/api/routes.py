from . import bp
from flask import url_for, jsonify, request, make_response
from flask_login import  login_required, current_user
from ..extensions import db
from ..models import CardSet, user_cardset_assn

@bp.route('/delete-cardset/<int:id>')
@login_required
def delete_cardset(id):
    cardset = CardSet.query.get(id)
    if not cardset:
        return jsonify({'error': 'Card set does not exist.'}), 400
    
    if cardset.user_id == current_user.id:
        db.session.delete(cardset)
        db.session.commit()
    elif current_user in cardset.followers.all():
        cardset.followers.remove(current_user)
        db.session.commit()
    else:
        return jsonify({'error': 'Card set is not own or saved for this user'}), 400

    return jsonify({'message': 'Card set has been deleted'})


@bp.route('/save-cardset/<int:id>', methods=['POST'])
@login_required
def save_cardset(id):
    cardset = CardSet.query.get(id)
    saved = current_user in cardset.followers.all()
    if not cardset:
        return jsonify({'error': 'Card set does not exist.'}), 400
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

    return jsonify({"saves": cardset.followers.count(), "saved": saved, "image_url":img_url}), 200


@bp.route('/cardsets', methods=['POST'])
def cardsets():
    dict_sort_by = {'saves': 'total_saves', 'date': 'card_sets.created_at', 'title': 'card_sets.title'}
    try:
        page = int(request.form.get('page'))
        cardsets_quantity = int(request.form.get('cardsets_quantity'))
        search_query = request.form.get('search_q')
        sort_by = request.form.get('sort_by') or 'saves'
        sort_order = request.form.get('sort_order') or 'desc'
        
        if page <= 0 or cardsets_quantity <= 0 or sort_by not in dict_sort_by or sort_order not in ['asc', 'desc']:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid request parameters'}), 400
        
    
    query = db.session.query(CardSet, db.func.count().label('total_saves'))\
        .join(user_cardset_assn).filter(CardSet.is_public)
        
    if search_query:
        query = query.filter(CardSet.title.like('%' + search_query + '%'))
        
    query = query.group_by(CardSet.id).order_by(db.text(f"{dict_sort_by[sort_by]} {sort_order}"))\
        .limit(cardsets_quantity).offset((page-1)*cardsets_quantity)
    
    result = []
    for row in query:
        try:
            saved = row[0] in current_user.saved_cardsets.all()
        except AttributeError:
            saved = False
        save_img_fn = 'images/save1.png' if saved else 'images/save2.png'
        save_img_url = url_for('static', filename=save_img_fn)
        cardset = {'id': row[0].id, 'title': row[0].title, 'saves': row[1], 'saved':saved, 'save_img_url':save_img_url }
        result.append(cardset)
        
    return jsonify(result), 200


