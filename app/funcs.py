from flask import current_app
from flask_mail import Message
from PIL import Image
from glob import glob
import os

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
    
    
def save_image(image, name, destination):
    _, f_ext = os.path.splitext(image.filename)
    picture_fn = name + f_ext
    picture_path = os.path.join(destination, picture_fn)

    output_size = (200, 200)
    i = Image.open(image)
    i.thumbnail(output_size)
    i.save(picture_path)

    return picture_fn


def save_audio(audio, name, destination):
    _, f_ext = os.path.splitext(audio.filename)
    audio_fn = name + f_ext
    audio_path = os.path.join(destination, audio_fn)
    audio.save(audio_path)

    return audio_fn


def delete_cardset_files(user_id, cardset_id, dir):
    files = glob(f'{user_id}_{cardset_id}_*', root_dir=dir)
    print(f'{user_id}_{cardset_id}_*')
    print(files)
    for file in files:
        os.remove(os.path.join(dir, file))
        