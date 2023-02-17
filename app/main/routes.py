from . import bp
from flask import render_template, url_for
from flask_login import login_required, current_user


@bp.route('/')
def index():
    return render_template('main/index.html')


@bp.route('/home')
def home():
    return render_template('main/home.html')

@bp.route('/profile')
@login_required
def profile():
    return render_template('main/profile.html')