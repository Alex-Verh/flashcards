from flask import Flask

from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    from .extensions import db, login_manager, mail, migrate
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    login_manager.init_app(app)
    login_manager.login_view = 'users.login'
    login_manager.login_message = "Login to access all platform features"
    login_manager.login_message_category = "success"
    
    from .models import User
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    mail.init_app(app)
    
    # Register blueprints here
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)
    
    from app.users import bp as users_bp
    app.register_blueprint(users_bp)
    
    from app.cards import bp as cards_bp
    app.register_blueprint(cards_bp)
    
    from app.common import bp as common_bp
    app.register_blueprint(common_bp)


    @app.route('/test')
    def test_page():
        return '<h1>Testing the Flask Application</h1>'
    
    return app