from flask_wtf import FlaskForm
from wtforms.fields import StringField, SubmitField, BooleanField, PasswordField
from wtforms.validators import DataRequired, Email, Length

class ContactForm(FlaskForm):
    name = StringField('Enter Name:', name='name', validators=[DataRequired()])
    email = StringField('Email Address:', name='email', validators=[Email()])
    title = StringField('Short Subject:', name='title', validators=[DataRequired()])
    message = StringField('Message to Us:', name='message', validators=[DataRequired()])
    submit = SubmitField('Send to Us')