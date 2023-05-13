from flask import render_template

from . import bp


@bp.route('/')
def index():
    return render_template('main/index.html')


@bp.route('/home', methods = ['GET'])
def home():
    return render_template('main/home.html')
