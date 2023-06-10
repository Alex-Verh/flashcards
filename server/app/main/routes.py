from flask import render_template

from . import bp


@bp.route("/cardsets")
def cardsets():
    return render_template("cardsets.html")


@bp.route("/")
def main():
    return render_template("main.html")


@bp.route("/set")
def cardset():
    return render_template("set.html")


@bp.route("/login")
def login():
    return render_template("login.html")


@bp.route("/register")
def register():
    return render_template("register.html")
