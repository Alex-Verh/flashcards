from flask import Flask

from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    from .extensions import db, login_manager, mail
    db.init_app(app)
    
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = "Login to access all platform features"
    login_manager.login_message_category = "success"
    
    mail.init_app(app)
    
    # Register blueprints here
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)
    
    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp)
    
    from app.common import bp as common_bp
    app.register_blueprint(common_bp)


    @app.route('/test')
    def test_page():
        return '<h1>Testing the Flask Application</h1>'
    
    return app