from flask_wtf import FlaskForm
from wtforms.fields import StringField, SubmitField, BooleanField, PasswordField
from wtforms.validators import DataRequired, Email, Length

class ContactForm(FlaskForm):
    name = StringField('Enter Name:', validators=[DataRequired()])
    email = StringField('Email Address:', validators=[Email()])
    title = StringField('Short Subject:', validators=[DataRequired()])
    message = StringField('Message to Us:', validators=[DataRequired()])
    submit = SubmitField('Send to Us')