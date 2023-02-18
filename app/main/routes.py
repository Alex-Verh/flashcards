from . import bp
from flask import render_template
from flask_login import login_required, current_user
from app.models import FlashCard

@bp.route('/')
def index():
    return render_template('main/index.html')


@bp.route('/home')
def home():
    return render_template('main/home.html')

