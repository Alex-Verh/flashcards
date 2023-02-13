from . import bp
from flask import render_template, request, redirect, url_for
from .forms import LoginForm, RegisterForm
# from app.extensions import db
# from app.models.user import Users


@bp.route('/login', methods=['POST', 'GET'])
def login():
    form = LoginForm()
    users = {'denis':'12345', 'alex':'54321'}
    
    if form.validate_on_submit():
        username = form.username.data
        if username in users and users[username] == form.password.data:
            return redirect(url_for('main.index'))  
        
        # or
        # username = request.form.get('username')
        # if username in users and users[username] == request.form.get('password'):
        #     return redirect(url_for('main.index'))
        
    return render_template('auth/login.html', form=form)


@bp.route('/register', methods=['POST', 'GET'])
def register():
    form = RegisterForm()
    return render_template('auth/register.html', form=form)