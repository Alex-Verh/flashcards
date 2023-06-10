import os

from flask import current_app, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, logout_user
from itsdangerous import SignatureExpired
from werkzeug.security import check_password_hash, generate_password_hash

from ..extensions import db, serializer
from ..funcs import delete_user_files, send_verification_email
from ..models import User
from . import bp
from .forms import LoginForm, RegisterForm


@bp.route("/login", methods=["POST", "GET"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.main"))

    form = LoginForm()
    if form.validate_on_submit():
        # if request.method == "POST":
        #     username = request.form.get("username")
        #     password = request.form.get("password")
        #     print(username, password)
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=True)
                return redirect(request.args.get("next") or url_for("main.main"))
            else:
                form.password.errors.append("Wrong password")
        else:
            form.username.errors.append("Such user does not exist")

    return render_template("login.html", form=form)


@bp.route("/logout", methods=["POST", "GET"])
@login_required
def logout():
    logout_user()
    flash("You have logged out", "success")
    return redirect(url_for("users.login"))


@bp.route("/register", methods=["POST", "GET"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("users.profile"))

    form = RegisterForm()
    if form.validate_on_submit():
        hashed_psw = generate_password_hash(form.password.data)
        email = form.email.data
        user_data = {
            "username": form.username.data,
            "email": email,
            "password": hashed_psw,
        }
        token = serializer.dumps(user_data, salt="email-confirm").encode("utf-8")
        verification_url = url_for(".confirm_email", token=token, _external=True)

        send_verification_email(verification_url, email)
        return render_template(
            "common/error.html",
            error="Verification link has been send to your email successfully",
        )

    return render_template("register.html", form=form)


@bp.route("/confirm-email/<token>")
def confirm_email(token):
    try:
        user_data = serializer.loads(token, salt="email-confirm", max_age=3600)
    except SignatureExpired:
        return render_template("common/error.html", error="Verification token expired!")

    try:
        new_user = User(
            username=user_data["username"],
            email=user_data["email"],
            password=user_data["password"],
        )
        db.session.add(new_user)
        db.session.commit()
    except:
        db.session.rollback()
        return render_template(
            "common/error.html", error="Error while working with database"
        )

    flash("You have registered successfully", "success")
    return redirect(url_for("users.login"))


@bp.route("/profile", methods=["POST", "GET"])
@login_required
def profile():
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
    return render_template("users/profile.html")


@bp.route("/delete-profile")
@login_required
def delete_profile():
    uploads_dir_path = os.path.join(
        current_app.root_path, current_app.config["UPLOAD_FOLDER"]
    )
    delete_user_files(current_user.id, uploads_dir_path)
    db.session.delete(current_user)
    db.session.commit()
    logout_user()
    flash("Your account was deleted successfully", "success")
    return redirect(url_for("users.register"))
