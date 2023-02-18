from . import bp
from flask import render_template, redirect, url_for, request, flash
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from .forms import LoginForm, RegisterForm
from app.extensions import db
from app.models import User, FlashCard


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
            form.username.errors.append("That user doesn't exist")

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
        try:
            new_user = User(
                name=form.name.data,
                username=form.username.data,
                password=hashed_psw)
            db.session.add(new_user)
            db.session.commit()
        except:
            db.session.rollback()
            flash('Error while working with database')
            return render_template('users/register.html', form=form)
        
        flash("You have registered successfully", "success")
        return redirect(url_for('users.login'))
    return render_template('users/register.html', form=form)


@bp.route('/profile')
@login_required
def profile():
    user_cards = FlashCard.query.filter_by(user_id=current_user.get_id()).all()
    return render_template('main/profile.html', user_cards=user_cards)