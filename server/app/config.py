from os import environ

from dotenv import load_dotenv

load_dotenv()


class Config:
    UPLOAD_FOLDER = "uploads"
    SECRET_KEY = environ.get("SECRET_KEY")

    # SQLALCHEMY_DATABASE_URI = os.environ.get("DB_URL")
    SQLALCHEMY_DATABASE_URI = environ.get("DB_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False

    MAIL_SERVER = environ.get("MAIL_SERVER")
    MAIL_PORT = int(environ.get("MAIL_PORT"))
    MAIL_USERNAME = environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = environ.get("MAIL_PASSWORD")
    MAIL_USE_TLS = True
