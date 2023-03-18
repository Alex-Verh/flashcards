from flask import url_for, jsonify, request
from flask_login import  login_required, current_user
from PIL import Image
import os
import secrets

from . import bp
from ..extensions import db
from ..models import CardSet, CardSetCategory, user_cardset_assn, FlashCard

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
    if not cardset:
        return jsonify({'error': 'Card set does not exist.'}), 400
    
    saved = current_user in cardset.followers.all()
    if saved:
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
        except AttributeError:
            saved = False
        save_img_fn = 'images/save1.png' if saved else 'images/save2.png'
        save_img_url = url_for('static', filename=save_img_fn)
        url = url_for('cards.cardset', id=row[0].id)
        cardset = {'id': row[0].id, 'title': row[0].title, 'saves': row[1], 'saved': saved, 'save_img_url': save_img_url, 'url': url }
        result.append(cardset)
        
    return jsonify(result), 200


@bp.route('/cardset-categories')
def cardset_categories():
    categories = [{'id': cat.id, 'title': cat.title} for cat in CardSetCategory.query]
    return jsonify(categories)

def save_image(image):
    random_hex = secrets.token_hex(12)
    _, f_ext = os.path.splitext(image.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join('/home/denis/Desktop/flashcards/app', 'uploads', picture_fn)

    output_size = (200, 200)
    i = Image.open(image)
    i.thumbnail(output_size)
    i.save(picture_path)

    return picture_fn

@bp.route('/create-flashcard', methods=['POST'])
@login_required
def create_flashcard():
    flashcard_attachments = {
        'frontside': {
            'images': [],
        },
        'backside': {
            'images': [],
        },
    }
    for image in request.files.getlist('front_images'):
        image_filename = save_image(image)
        flashcard_attachments['frontside']['images'].append(image_filename)
    for image in request.files.getlist('back_images'):
        image_filename = save_image(image)
        flashcard_attachments['backside']['images'].append(image_filename)
        
    
    front_audio = request.files.get('front_audio')
    if front_audio:
        _, f_ext = os.path.splitext(front_audio.filename)
        audio_fn = secrets.token_hex(12) + f_ext
        front_audio.save(os.path.join('/home/denis/Desktop/flashcards/app', 'uploads', audio_fn))
        flashcard_attachments['frontside']['audio'] = audio_fn
        
    back_audio = request.files.get('back_audio')
    if back_audio:
        _, f_ext = os.path.splitext(back_audio.filename)
        audio_fn = secrets.token_hex(12) + f_ext
        back_audio.save(os.path.join('/home/denis/Desktop/flashcards/app', 'uploads', audio_fn))
        flashcard_attachments['backside']['audio'] = audio_fn

    flashcard = FlashCard(
        title=request.form.get('title'),
        content=request.form.get('content'),
        attachments=flashcard_attachments,
        cardset_id = request.form.get('cardset_id')
    )
    db.session.add(flashcard)
    db.session.commit()
    
    return jsonify({'message': 'Files uploaded and resized successfully'}), 200
