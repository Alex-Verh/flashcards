from flask_login import login_required

from . import bp

from .service import ApiService


@bp.route("/delete-cardset/<int:id>")
@login_required
def delete_cardset(id):
    return ApiService.delete_cardset(id)

@bp.route("/save-cardset/<int:id>")
@login_required
def save_cardset(id):
    return ApiService.save_cardset(id)

@bp.route("/cardsets")
def cardsets():
    return ApiService.get_cardsets()

@bp.route("/cardset-categories")
def cardset_categories():
    return ApiService.get_categories()

@bp.route("/create-flashcard", methods=["POST"])
@login_required
def create_flashcard():
    return ApiService.create_flashcard()

@bp.route("/flashcards", methods=["POST"])
def flashcards():
    return ApiService.get_flashcards()