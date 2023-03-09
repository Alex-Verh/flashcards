from flask import render_template, redirect, url_for, request, flash
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import SignatureExpired

from . import bp
from .forms import LoginForm, RegisterForm
from ..extensions import db, serializer
from ..models import User
from ..funcs import send_verification_email


@bp.route('/login', methods=['POST', 'GET'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('users.profile'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=True)
                return redirect(request.args.get("next") or url_for("main.home"))
            else:
                form.password.errors.append("Wrong password")
        else:
            form.username.errors.append("Such user does not exist")

    return render_template('users/login.html', form=form)


@bp.route('/logout', methods=['POST', 'GET'])
@login_required
def logout():
    logout_user()
    flash("You have logged out", "success")
    return redirect(url_for('users.login'))


@bp.route('/register', methods=['POST', 'GET'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('users.profile'))
    
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_psw = generate_password_hash(form.password.data)
        email = form.email.data
        user_data = {'username':form.username.data,
                     'email': email,
                     'password': hashed_psw}
        token = serializer.dumps(user_data, salt='email-confirm').encode('utf-8')
        verification_url = url_for('.confirm_email', token=token, _external=True)
        
        send_verification_email(verification_url, email)
        return render_template('common/error.html', error='Verification link has been send to your email successfully')
    
    return render_template('users/register.html', form=form)


@bp.route('/confirm-email/<token>')
def confirm_email(token):
    try:
        user_data = serializer.loads(token, salt='email-confirm', max_age=3600)
    except SignatureExpired:
        return render_template('common/error.html', error='Verification token expired!')
    
    try:
        new_user = User(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'])
        db.session.add(new_user)
        db.session.commit()
    except:
        db.session.rollback()
        return render_template('common/error.html', error='Error while working with database')

    flash("You have registered successfully", "success")
    return redirect(url_for('users.login'))
    

@bp.route('/profile')
@login_required
def profile():
    return render_template('users/profile.html')
