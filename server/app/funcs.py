import os
from tempfile import TemporaryFile

from flask_mail import Message
from PIL import Image
from pydub import AudioSegment

from .config import Config
from .extensions import db, mail, s3_bucket
from .models import CardSet, FlashCard


def send_feedback_email(
    form, recipients=["denis.bargan2006@gmail.com", "signey03@gmail.com"]
):
    msg = Message(
        "Feedback", sender=("FlashCards", "noreply@demo.com"), recipients=recipients
    )
    msg.body = f"Name: {form.name.data}\n\nEmail: {form.email.data}\n\nTitle: {form.title.data}\n\nMessage:\n{form.message.data}"
    mail.send(msg)


def send_verification_email(verification_url, recipient):
    msg = Message(
        "Verify your email",
        sender=("FlashCards", "noreply@demo.com"),
        recipients=[recipient],
    )
    msg.body = f"Please, verify your email: {verification_url}"
    mail.send(msg)


def save_image(image, name):
    image_fn = name + os.path.splitext(image.filename)[-1]

    img_file = TemporaryFile()
    img = Image.open(image)
    img.thumbnail((300, 300))
    img.save(img_file, image.mimetype.split("/")[-1])
    img_file.seek(0)
    s3_bucket.upload_fileobj(
        img_file, image_fn, ExtraArgs={"ContentType": image.content_type}
    )
    img_file.close()
    return get_bucket_file_url(image_fn)


def save_audio(audio, name):
    try:
        _, f_ext = os.path.splitext(audio.filename)
        audio_fn = name + ".mp3"

        audio_segment = AudioSegment.from_file(audio, format=f_ext.lstrip("."))
        audio_file = audio_segment.export(format="mp3", bitrate="64k")

        s3_bucket.upload_fileobj(
            audio_file, audio_fn, ExtraArgs={"ContentType": "audio/mpeg"}
        )
        audio_file.close()
        return get_bucket_file_url(audio_fn)

    except Exception as e:
        print(e)

    return audio_fn


def get_bucket_file_url(filename):
    return f"https://{Config.AWS_BUCKET_NAME}.s3.{Config.AWS_REGION_NAME}.amazonaws.com/{filename}"


def get_bucket_file_name(file_url):
    return file_url.split("/")[-1]


def get_files_urls_from_attachments(attachments):
    files_urls = []
    for attachment in attachments:
        for side in attachment[0].values():
            for section in side.values():
                if section:
                    files_urls.extend(section) if type(
                        section
                    ) == list else files_urls.append(section)
    return files_urls


def delete_cardset_files(cardset_id):
    cardset_attachments = (
        db.session.query(FlashCard.attachments)
        .filter(FlashCard.cardset_id == cardset_id)
        .all()
    )
    files_urls = get_files_urls_from_attachments(cardset_attachments)
    s3_bucket.delete_objects(
        Delete={
            "Objects": [{"Key": get_bucket_file_name(url)} for url in files_urls],
            "Quiet": True,
        }
    )


def delete_user_files(user_id):
    user_attachments = (
        db.session.query(FlashCard.attachments)
        .join(CardSet)
        .filter(CardSet.user_id == user_id)
        .all()
    )
    files_urls = get_files_urls_from_attachments(user_attachments)
    s3_bucket.delete_objects(
        Delete={
            "Objects": [{"Key": get_bucket_file_name(url)} for url in files_urls],
            "Quiet": True,
        }
    )
