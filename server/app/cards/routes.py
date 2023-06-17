from . import bp
from .service import CardsService


@bp.route("/cardset/<int:id>")
def cardset(id):
    return CardsService.get_cardset(id)
