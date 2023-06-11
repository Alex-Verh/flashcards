from flask import Response
from flask_login import login_required

from . import bp
from .service import ApiService


@bp.route("/cardsets", methods=["GET"])
def get_cardsets() -> Response:
    return ApiService.get_cardsets()


@bp.route("/cardsets/categories", methods=["GET"])
def get_cardset_categories() -> Response:
    return ApiService.get_categories()


@bp.route("/cardset/<int:id>", methods=["GET"])
def get_cardset(id: int) -> Response:
    return ApiService.get_cardset(id)


@bp.route("/cardset", methods=["POST"])
def create_cardset() -> Response:
    return ApiService.create_cardset()


@bp.route("/cardset/<int:id>", methods=["DELETE"])
@login_required
def delete_cardset(id: int) -> Response:
    return ApiService.delete_cardset(id)


@bp.route("/cardset/save/<int:id>", methods=["PATCH"])
@login_required
def save_cardset(id: int) -> Response:
    return ApiService.save_cardset(id)


@bp.route("/flashcard", methods=["POST"])
@login_required
def create_flashcard() -> Response:
    return ApiService.create_flashcard()


@bp.route("/flashcard/<int:id>", methods=["DELETE"])
@login_required
def delete_flashcard(id) -> Response:
    return ApiService.delete_flashcard(id)
