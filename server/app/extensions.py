import boto3
from flask_cors import CORS
from flask_login import LoginManager
from flask_mail import Mail
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from itsdangerous import URLSafeTimedSerializer

from .config import Config

# SQLAlchemy
db = SQLAlchemy()

# LoginManager
login_manager = LoginManager()

# Mail
mail = Mail()

# Migrate
migrate = Migrate()

# Cors
cors = CORS(resources={r"/*": {"origins": "*"}}, allow_headers="*")

# Serializer
serializer = URLSafeTimedSerializer(Config.SECRET_KEY)

# Amazon S3
amazon_s3 = boto3.resource(
    "s3",
    region_name=Config.AWS_REGION_NAME,
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
)

s3_bucket = amazon_s3.Bucket(Config.AWS_BUCKET_NAME)
