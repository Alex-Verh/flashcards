from . import bp
from flask import render_template, flash, redirect, url_for
from .forms import ContactForm
from ..funcs import send_feedback_email


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
        send_feedback_email(form)
        flash('Your message has been sent successfully', category='success')
        return redirect(url_for('common.contact'))
    
    return render_template('common/contact.html', form=form)


@bp.errorhandler(404)
def page_not_found(error):
    return render_template('common/page_not_found.html', message='Page not found')