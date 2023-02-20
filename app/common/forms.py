from flask_wtf import FlaskForm
from wtforms.fields import StringField, SubmitField
from wtforms.validators import DataRequired, Email, Length, Regexp

# TODO add regex
class ContactForm(FlaskForm):
    name = StringField('Enter Name:', validators=[DataRequired("Please enter your name"), Length(3, 30, "Length must be between 3-30 characters.")])
    email = StringField('Email Address:', validators=[DataRequired("Please enter your email address"), Email("Enter valid email"), Length(3, 50, "Length must be between 3-50 characters.")])
    title = StringField('Short Subject:', validators=[DataRequired("Please enter your title"), Length(3, 30, "Length must be between 3-20 characters.")])
    message = StringField('Message to Us:', validators=[DataRequired("Please enter your message"), Length(3, 200, "Length must be between 3-100 characters.")])
    submit = SubmitField('Send to Us')