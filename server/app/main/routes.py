from flask import render_template

from . import bp


@bp.route("/")
def main():
    return render_template("main.html")


@bp.route("/cardsets")
def cardsets():
    return render_template("cardsets.html")
