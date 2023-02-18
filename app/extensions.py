from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail

# SQLAlchemy
db = SQLAlchemy()

# LoginManager
login_manager = LoginManager()

# Mail
mail = Mail()