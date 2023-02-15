from flask_wtf import FlaskForm
from wtforms.fields import StringField, SubmitField
from wtforms.validators import DataRequired, Email, Length, Regexp

class ContactForm(FlaskForm):
    name = StringField('Enter Name:', validators=[DataRequired("Please enter your name"), Regexp('^\w+$', message="Name must contain only letters or numbers"), Length(3, 15, "Length must be between 3-15 characters.")])
    email = StringField('Email Address:', validators=[Email("Please enter your email address"), Length(3, 20, "Length must be between 3-20 characters.")])
    title = StringField('Short Subject:', validators=[DataRequired("Please enter your title"), Regexp('^\w+$', message="Title must contain only letters or numbers"), Length(3, 20, "Length must be between 3-20 characters.")])
    message = StringField('Message to Us:', validators=[DataRequired("Please enter your message"), Regexp('^\w+$', message="Message must contain only letters or numbers"), Length(3, 100, "Length must be between 3-100 characters.")])
    submit = SubmitField('Send to Us')