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
from .forms import ChangePswForm, LoginForm, RegisterForm


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
    return redirect(url_for(".login"))


@bp.route("/register", methods=["POST", "GET"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("main.main"))

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
            email, "mails/verification.html", "Confirm your email", url=verification_url
        )
        flash(
            "Please check your email. We have send verification message to complete registration.",
            "info",
        )
        return redirect(url_for(".login"))

    return render_template("register.html", form=form)


@bp.route("/confirm-email/<token>")
def confirm_email(token):
    try:
        user_data = serializer.loads(token, salt="email-confirm", max_age=3600)
    except SignatureExpired:
        flash("Verification token has been expired!", "error")
        return redirect(url_for(".register"))
    except BadData:
        flash("Invalid verification token!", "error")
        return redirect(url_for(".register"))
    if User.query.filter_by(username=user_data["username"]).first():
        flash("You have already registred!", "info")
        return redirect(url_for(".login"))
    new_user = User(
        username=user_data["username"],
        email=user_data["email"],
        password=user_data["password"],
    )
    db.session.add(new_user)
    db.session.commit()
    flash("You have registered successfully", "success")
    return redirect(url_for(".login"))


@bp.route("/update-email/<token>")
@login_required
def update_email(token):
    try:
        new_email = serializer.loads(token, salt="update-email", max_age=3600)
        current_user.email = new_email["new_email"]
        db.session.commit()
    except SignatureExpired:
        flash("Verification token has been expired!", "error")
    except BadData:
        flash("Invalid verification token!", "error")
    return redirect(url_for("main.main"))


@bp.route("/delete-account/<token>")
@login_required
def delete_account(token):
    try:
        user_info = serializer.loads(token, salt="delete-account", max_age=3600)
    except SignatureExpired:
        flash("Verification token has been expired!", "error")
        return redirect(url_for("main.main"))
    except BadData:
        flash("Invalid verification token!", "error")
        return redirect(url_for("main.main"))
    if getattr(current_user, "id", 0) != user_info["id"]:
        flash("Please login to account that you want to delete!", "error")
        return redirect(url_for(".login"))
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
    return redirect(url_for(".register"))


@bp.route("/change-password/<token>", methods=["POST", "GET"])
def change_password(token):
    try:
        user_id = serializer.loads(token, salt="reset-password", max_age=3600)["id"]
        user = User.query.get(int(user_id))
        if not user:
            flash("User does not exist", "error")
            return
        form = ChangePswForm()
        if form.validate_on_submit():
            hashed_password = generate_password_hash(form.password.data)
            user.password = hashed_password
            db.session.commit()
            flash("Your password changed successfully", "success")
            return redirect(url_for(".login"))
        return render_template("change-password.html", form=form)
    except SignatureExpired:
        flash("Verification token has been expired!", "error")
    except BadData:
        flash("Invalid verification token!", "error")
    return redirect(url_for("main.main"))
