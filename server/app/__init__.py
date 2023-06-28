from flask import Flask, render_template

from .config import Config


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    # Initialize Flask extensions here
    from .extensions import cors, db, login_manager, mail, migrate

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)

    login_manager.init_app(app)

    from .models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    mail.init_app(app)

    # Register blueprints here
    from .main import bp as main_bp

    app.register_blueprint(main_bp)

    from .users import bp as users_bp

    app.register_blueprint(users_bp)

    from .cards import bp as cards_bp

    app.register_blueprint(cards_bp)

    from .api import bp as api_bp

    app.register_blueprint(api_bp)

    # @app.errorhandler(404)
    # def page_not_found(error):
    #     return render_template("common/error.html", error="Page Not Found!")

    @app.errorhandler(403)
    def access_denied(error):
        return render_template(
            "common/error.html",
            error="This is a private card set >:( Create your own one.",
        )

    return app
