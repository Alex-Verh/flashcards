from . import bp
from flask import render_template, redirect, url_for, flash
from .forms import LoginForm, RegisterForm
# from app.extensions import db
# from app.models.user import Users

users = {'denis':'12345228', 'alex':'123456789'}

@bp.route('/login', methods=['POST', 'GET'])
def login():
    form = LoginForm()
    
    if form.validate_on_submit():
        username = form.username.data
        if username in users:
            if users[username] == form.password.data:
                return redirect(url_for('main.index')) 
            form.password.errors.append('Password is incorrect')
        else:
            form.username.errors.append('Username is incorrect')

    return render_template('auth/login.html', form=form)


@bp.route('/register', methods=['POST', 'GET'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        if username not in users:
            users[username] = password
            return redirect(url_for('auth.login'))
        form.username.errors.append('User with this username already exists')
    return render_template('auth/register.html', form=form)