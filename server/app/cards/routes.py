from flask_login import login_required

from . import bp
from .service import CardsService


@bp.route("/cardset/<int:id>")
def cardset(id):
    return CardsService.get_cardset(id)


@bp.route("/learn/", defaults={"id": None})
@bp.route("/learn/<int:id>")
def learn(id):
    return CardsService.learn(id)
