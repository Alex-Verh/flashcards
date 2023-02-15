from . import bp
from flask import render_template, redirect, url_for


@bp.route('/')
def index():
    return render_template('main/index.html')


@bp.route('/home')
def home():
    return render_template('main/home.html')