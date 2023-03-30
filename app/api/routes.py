from flask import url_for, jsonify, request, current_app
from flask_login import  login_required, current_user
import secrets
import os

from . import bp
from ..extensions import db
from ..models import CardSet, CardSetCategory, user_cardset_assn, FlashCard
from ..funcs import save_image, save_audio, delete_cardset_files

@bp.route('/delete-cardset/<int:id>')
@login_required
def delete_cardset(id):
    cardset = CardSet.query.get(id)
    if not cardset:
        return jsonify({'error': 'Card set does not exist.'}), 400
    
    if cardset.user_id == current_user.id:
        uploads_dir_path = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER']) 
        delete_cardset_files(current_user.id, cardset.id, uploads_dir_path)
        
        db.session.delete(cardset)
        db.session.commit()
    elif current_user in cardset.followers.all():
        cardset.followers.remove(current_user)
        db.session.commit()
    else:
        return jsonify({'error': 'Card set is not own or saved for this user'}), 400

    return jsonify({'message': 'Card set has been deleted'})


@bp.route('/save-cardset/<int:id>')
@login_required
def save_cardset(id):
    cardset = CardSet.query.get(id)
    if not cardset:
        return jsonify({'error': 'Card set does not exist.'}), 400
    if cardset in current_user.own_cardsets.all():
        return jsonify({'error': 'You can not save your own card set'}), 400
    
    saved = current_user in cardset.followers.all()
    if saved:
        cardset.followers.remove(current_user)
        db.session.commit()
        saved = False
    else:
        cardset.followers.append(current_user)
        db.session.commit()
        saved = True

    return jsonify({"saves": cardset.followers.count(), "saved": saved})


@bp.route('/cardsets', methods=['POST'])
def cardsets():
    dict_sort_by = {'saves': 'total_saves', 'date': 'card_sets.created_at', 'title': 'card_sets.title'}
    try:
        page = int(request.form.get('page'))
        cardsets_quantity = int(request.form.get('cardsets_quantity'))
        search_query = request.form.get('search_q')
        sort_by = request.form.get('sort_by') or 'saves'
        sort_order = request.form.get('sort_order') or 'desc'
        category = int(request.form.get('category'))
        
        if page <= 0 or cardsets_quantity <= 0 or sort_by not in dict_sort_by or sort_order not in ['asc', 'desc']:
            raise ValueError
        
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid request parameters'}), 400
        
    
    query = db.session.query(CardSet, db.text('count(user_cardset_assn.cardset_id) AS total_saves'))\
        .join(user_cardset_assn, isouter = True).filter(CardSet.is_public)
        
    if search_query:
        query = query.filter(CardSet.title.like('%' + search_query + '%'))
    
    if category:
        query = query.filter(CardSet.category_id == category)
        
    query = query.group_by(CardSet.id).order_by(db.text(f"{dict_sort_by[sort_by]} {sort_order}"))\
        .limit(cardsets_quantity).offset((page-1)*cardsets_quantity)
    result = []
    for row in query:
        try:
            saved = row[0] in current_user.saved_cardsets.all()
            own = row[0] in current_user.own_cardsets.all()
        except AttributeError:
            saved = False
            own = False
        save_img_fn = 'images/save1.png' if saved else 'images/save2.png'
        save_img_url = url_for('static', filename=save_img_fn)
        url = url_for('cards.cardset', id=row[0].id)
        cardset = {'id': row[0].id, 'title': row[0].title, 'saves': row[1], 'saved': saved, 'own': own, 'save_img_url': save_img_url, 'url': url }
        result.append(cardset)
        
    return jsonify(result), 200


@bp.route('/cardset-categories')
def cardset_categories():
    categories = [{'id': cat.id, 'title': cat.title} for cat in CardSetCategory.query]
    return jsonify(categories)


@bp.route('/create-flashcard', methods=['POST'])
@login_required
def create_flashcard():
    cardset_id = request.form.get('cardset_id')
    cardset = CardSet.query.get(cardset_id)
    
    if cardset not in current_user.own_cardsets.all():
        return jsonify({'error': 'This card set is not yours'}), 400
        
    front_images = request.files.getlist('front_images')
    back_images = request.files.getlist('back_images')
    
    front_audio = request.files.get('front_audio')
    back_audio = request.files.get('back_audio')
    
    base_filename = f"{current_user.id}_{cardset_id}_"
    uploads_dir_path = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER']) 
    
    flashcard_attachments = {
        'frontside': {
            'images': []
        },
        'backside': {
            'images': []
        },
    }
    
    for image in front_images:
        image_filename = save_image(image,
                                    base_filename + secrets.token_hex(6), 
                                    uploads_dir_path)
        flashcard_attachments['frontside']['images'].append(image_filename)
    for image in back_images:
        image_filename = save_image(image, 
                                    base_filename + secrets.token_hex(6), 
                                    uploads_dir_path)
        flashcard_attachments['backside']['images'].append(image_filename)
        
    if front_audio:
        flashcard_attachments['frontside']['audio'] = save_audio(front_audio,
                                                                 base_filename + secrets.token_hex(6),
                                                                 uploads_dir_path)
        
    if back_audio:
        flashcard_attachments['backside']['audio'] = save_audio(back_audio,
                                                                base_filename + secrets.token_hex(6),
                                                                uploads_dir_path)

    flashcard = FlashCard(
        title = request.form.get('title'),
        content = request.form.get('content'),
        attachments = flashcard_attachments,
        cardset_id = cardset_id
    )
    db.session.add(flashcard)
    db.session.commit()
    
    return jsonify({'message': 'Files uploaded and resized successfully'}), 200

@bp.route('/flashcards', methods=['POST'])
def flashcards():
    cardset_id = request.form.get('cardset_id', type=int)
    cardset = CardSet.query.get(cardset_id)
    if not cardset:
        return jsonify({'error': 'Card set does not exist.'}), 400
    
    if (not cardset.is_public) and cardset.author != current_user:
        return jsonify({'error': 'You can not access this card set'}), 403
    
    response = []
    
    for flash_card in cardset.flash_cards:
        response.append({
            'id': flash_card.id,
            'title': flash_card.title,
            'content': flash_card.content,
            'attachments': flash_card.attachments
        })
    
    return jsonify(response)
