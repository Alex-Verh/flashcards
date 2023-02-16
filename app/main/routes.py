from . import bp
from flask import render_template
from flask_login import login_required, current_user, AnonymousUserMixin


@bp.route('/')
def index():
    return render_template('main/index.html')


@bp.route('/home')
def home():
    if isinstance(current_user, AnonymousUserMixin):
        authorized = False
    else:

        authorized = True
    return render_template('main/home.html', authorized=authorized)

@bp.route('/profile')
@login_required
def profile():
    return f'User: {current_user.username}'