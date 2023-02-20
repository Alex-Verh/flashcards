from . import bp
from flask import render_template, request

@bp.route('/')
def index():
    return render_template('main/index.html')


@bp.route('/home', methods = ['GET'])
def home():
    search = request.args.get('search')
    if search:
        print("TY ebobo!", search)
    return render_template('main/home.html')
