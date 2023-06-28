from flask import flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, logout_user
from itsdangerous import BadData, SignatureExpired
from werkzeug.security import check_password_hash, generate_password_hash

from ..extensions import db, serializer
from ..funcs import (
    delete_files_from_bucket,
    get_filenames_from_attachments,
    send_verification_email,
)
from ..models import CardSet, FlashCard, User
from . import bp
from .forms import LoginForm, RegisterForm


@bp.route("/login", methods=["POST", "GET"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.main"))

    form = LoginForm()
    if form.validate_on_submit():
        user = (
            User.query.filter_by(username=form.username.data).first()
            or User.query.filter_by(email=form.username.data).first()
        )
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

        send_verification_email(
            email, "mails/verification.html", "Verify your email", url=verification_url
        )
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
    except BadData:
        return render_template("common/error.html", error="Invalid verification token")
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


@bp.route("/update-email/<token>")
@login_required
def update_email(token):
    try:
        new_email = serializer.loads(token, salt="update-email", max_age=3600)
    except SignatureExpired:
        return render_template("common/error.html", error="Verification token expired!")
    except BadData:
        return render_template("common/error.html", error="Invalid verification token")
    current_user.email = new_email["new_email"]
    db.session.commit()
    return redirect(url_for("main.main"))


@bp.route("/delete-account/<token>")
@login_required
def delete_account(token):
    try:
        user_info = serializer.loads(token, salt="delete-account", max_age=3600)
    except SignatureExpired:
        return render_template("common/error.html", error="Verification token expired!")
    except BadData:
        return render_template("common/error.html", error="Invalid verification token")
    if current_user.id == user_info["id"]:
        user_attachments = (
            db.session.query(FlashCard.attachments)
            .join(CardSet)
            .filter(CardSet.user_id == current_user.id)
            .all()
        )
        filenames = get_filenames_from_attachments(user_attachments)
        filenames and delete_files_from_bucket(filenames)
        db.session.delete(current_user)
        db.session.commit()
        logout_user()
        flash("Your account was deleted successfully", "success")
        return redirect(url_for("users.register"))
    return redirect(url_for("users.login"))
