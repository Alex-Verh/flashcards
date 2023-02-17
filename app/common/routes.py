from . import bp
from flask import render_template, flash
from .forms import ContactForm


@bp.route('/about')
def about():
    return render_template('common/about.html')


@bp.route('/help')
def help():
    return render_template('common/help.html')


@bp.route('/contact', methods=['POST', 'GET'])
def contact():
    form = ContactForm()
    if form.validate_on_submit():
        flash('Your message has been sent successfully', category='success')
    return render_template('common/contact.html', form=form)


@bp.errorhandler(404)
def page_not_found(error):
    return render_template('main/index.html', message='Page not found')