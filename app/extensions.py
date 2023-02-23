from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
from flask_migrate import Migrate

# SQLAlchemy
db = SQLAlchemy()

# LoginManager
login_manager = LoginManager()

# Mail
mail = Mail()

# Migrate
migrate = Migrate()
