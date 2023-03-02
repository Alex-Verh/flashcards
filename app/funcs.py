from typing import Literal
from flask_mail import Message
from .extensions import db, mail
from .models import User, CardSet, FlashCard, CardSetCategory, user_cardset_assn


def get_most_popular_cardsets(amount=48):
    query = db.session.query(CardSet, db.func.count().label('total_saves'))\
        .join(user_cardset_assn).filter(CardSet.is_public)\
        .group_by(CardSet.id).order_by(db.text('total_saves DESC')).limit(amount)
        
    card_sets = [{'id': row[0].id, 'title': row[0].title, 'saves': row[1]} for row in query]
    return card_sets


def get_cardset_search_results(search_query: str, sort_by: Literal['saves', 'date', 'title'], sort_order: Literal['asc', 'desc']):
    query = db.session.query(CardSet, db.func.count().label('total_saves'))\
        .join(user_cardset_assn)\
        .filter(CardSet.is_public).filter(CardSet.title.like('%' + search_query + '%'))\
        .group_by(CardSet.id)
    
    if sort_order is None:
        sort_order = ''
    
    if sort_by:
        if sort_by == 'saves':
            order_param = db.text(f'total_saves {sort_order}')
        elif sort_by == 'date':
            order_param = db.text(f'card_sets.created_at {sort_order}')
        elif sort_by == 'title':
            order_param = db.text(f'card_sets.title {sort_order}')
    
        query = query.order_by(order_param) 
    
    card_sets = [{'id': row[0].id, 'title': row[0].title, 'saves': row[1]} for row in query]
    return card_sets

    
def send_feedback_email(form, recipients=['denis.bargan2006@gmail.com', 'signey03@gmail.com']):
    msg = Message('Feedback',
                  sender=('FlashCards', 'noreply@demo.com'),
                  recipients=recipients)
    msg.body = f'Name: {form.name.data}\n\nEmail: {form.email.data}\n\nTitle: {form.title.data}\n\nMessage:\n{form.message.data}'
    mail.send(msg)
