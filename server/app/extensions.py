from os import environ

from flask_cors import CORS
from flask_login import LoginManager
from flask_mail import Mail
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from itsdangerous import URLSafeTimedSerializer

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
serializer = URLSafeTimedSerializer(environ.get("SECRET_KEY"))
