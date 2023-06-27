import os
from tempfile import TemporaryFile
from uuid import uuid4

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


def save_image(image):
    image_fn = uuid4().hex + os.path.splitext(image.filename)[-1]

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


def save_audio(audio):
    try:
        audio_fn = uuid4().hex + ".mp3"
        audio_segment = AudioSegment.from_file(
            audio, format=os.path.splitext(audio.filename).lstrip(".")
        )
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


def delete_files_from_bucket(filenames):
    s3_bucket.delete_objects(
        Delete={
            "Objects": [{"Key": filename} for filename in filenames],
            "Quiet": True,
        }
    )


def get_filenames_from_attachments(attachments):
    filesnames = []
    for attachment in attachments:
        for side in attachment[0].values():
            for section in side.values():
                if section:
                    urls = section if type(section) == list else [section]
                    names = [url.split("/")[-1] for url in urls]
                    filesnames.extend(names)
    return filesnames


def delete_user_files(user_id):
    user_attachments = (
        db.session.query(FlashCard.attachments)
        .join(CardSet)
        .filter(CardSet.user_id == user_id)
        .all()
    )
    delete_files_from_bucket(get_filenames_from_attachments(user_attachments))
