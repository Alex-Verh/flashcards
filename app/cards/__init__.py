from flask import Blueprint

bp = Blueprint('cards', __name__, url_prefix='/cards')

from . import routes