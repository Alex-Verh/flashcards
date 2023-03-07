from flask_mail import Message
from .extensions import mail

def send_feedback_email(form, recipients=['denis.bargan2006@gmail.com', 'signey03@gmail.com']):
    msg = Message('Feedback',
                  sender=('FlashCards', 'noreply@demo.com'),
                  recipients=recipients)
    msg.body = f'Name: {form.name.data}\n\nEmail: {form.email.data}\n\nTitle: {form.title.data}\n\nMessage:\n{form.message.data}'
    mail.send(msg)


def send_verification_email(verification_url, recipient):
    msg = Message('Verify your email',
                  sender=('FlashCards', 'noreply@demo.com'),
                  recipients=[recipient])
    msg.body = f'Please, verify your email: {verification_url}'
    mail.send(msg)