from . import bp
from flask import render_template
from app.extensions import db
from app.models.user import Users

@bp.route('/login', methods=['POST', 'GET'])
def login():
    return render_template('auth/login.html')


@bp.route('/register', methods=['POST', 'GET'])
def register():
    return render_template('auth/register.html')