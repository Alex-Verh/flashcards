from . import bp
from flask import render_template, flash, redirect, url_for
from .forms import ContactForm
from flask_mail import Message
from app.extensions import mail


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
        msg = Message('Feedback',
                  sender=('FlashCards', 'noreply@demo.com'),
                  recipients=['denis.bargan2006@gmail.com', 'signey03@gmail.com'])
        msg.body = f'Name: {form.name.data}\n\nEmail: {form.email.data}\n\nTitle: {form.title.data}\n\nMessage:\n{form.message.data}'
        mail.send(msg)
        flash('Your message has been sent successfully', category='success')
        return redirect(url_for('common.contact'))
    
    return render_template('common/contact.html', form=form)


@bp.errorhandler(404)
def page_not_found(error):
    return render_template('main/index.html', message='Page not found')