from . import bp
from flask import render_template, redirect, url_for, flash
from .forms import LoginForm, RegisterForm
# from app.extensions import db
# from app.models.user import Users


@bp.route('/login', methods=['POST', 'GET'])
def login():
    form = LoginForm()
    users = {'denis':'12345228', 'alex':'123456789', }
    
    if form.validate_on_submit():
        username = form.username.data
        if username in users:
            if users[username] == form.password.data:
                return redirect(url_for('main.index')) 
            else:
                message = 'Password is incorrect'
        else:
            message = 'Username is incorrect'
        flash(message, category='error')

    return render_template('auth/login.html', form=form)


@bp.route('/register', methods=['POST', 'GET'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        return redirect(url_for('main.index'))
    return render_template('auth/register.html', form=form)