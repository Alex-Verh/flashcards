from . import bp
from flask import render_template, redirect, url_for
from .forms import ContactForm

@bp.route('/')
def index():
    return render_template('index.html')


@bp.route('/about')
def about():
    return render_template('main/about.html')

@bp.route('/home')
def home():
    return render_template('main/home.html')

@bp.route('/help')
def help():
    return render_template('main/help.html')


@bp.route('/contact', methods=['POST', 'GET'])
def contact():
    # if request.method == 'POST':
    #     name = request.form.get('name')
    #     email = request.form.get('email')
    #     title = request.form.get('title')
    #     message = request.form.get('message')
        
    #     if email.endswith('gmail.com'):
            
    #         flash('Success', category='success')
    #     else:
    #         flash('Error', category = 'error')
    form = ContactForm()
    if form.validate_on_submit():
        return redirect(url_for('main.index'))
    return render_template('main/contact.html', form=form)


@bp.errorhandler(404)
def page_not_found(error):
    return render_template('index.html', message='Page not found')