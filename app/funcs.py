from flask_mail import Message
from .extensions import mail


def send_feedback_email(form, recipients=['denis.bargan2006@gmail.com', 'signey03@gmail.com']):
    msg = Message('Feedback',
                  sender=('FlashCards', 'noreply@demo.com'),
                  recipients=recipients)
    msg.body = f'Name: {form.name.data}\n\nEmail: {form.email.data}\n\nTitle: {form.title.data}\n\nMessage:\n{form.message.data}'
    mail.send(msg)
