from flask import Blueprint

bp = Blueprint('cards', __name__)

from . import routes