from . import bp
from flask import render_template, flash, request


@bp.route('/')
def index():
    return render_template('index.html')


@bp.route('/about')
def about():
    return render_template('main/about.html')


@bp.route('/help')
def help():
    return render_template('main/help.html')


@bp.route('/contact', methods=['POST', 'GET'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        title = request.form.get('title')
        message = request.form.get('message')
        
        if email.endswith('gmail.com'):
            
            flash('Success', category='success')
        else:
            flash('Error', category = 'error')
    return render_template('main/contact.html')


@bp.errorhandler(404)
def page_not_found(error):
    return render_template('index.html', message='Page not found')