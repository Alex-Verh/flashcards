from flask_wtf import FlaskForm
from wtforms.fields import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Length, EqualTo


class LoginForm(FlaskForm):
    username = StringField('Username:', validators=[DataRequired("Please enter your username"), Length(3, 15, "Length must be between 3-15 characters.")])
    password = PasswordField('Password:', validators=[DataRequired(), Length(8, 20, "Length must be between 8-20 characters.")])
    submit = SubmitField('Login')

    
class RegisterForm(FlaskForm):
    name = StringField('Name:', validators=[DataRequired("Please enter your name"),  Length(3, 30,"Length must be between 3-30 characters.")])
    username = StringField('Username:', validators=[DataRequired("Please enter your username"),  Length(3, 15,"Length must be between 3-15 characters.")])
    password = PasswordField('Password:', validators=[DataRequired("Please enter your password"), Length(8, 20,"Length must be between 8-20 characters.")])
    password1 = PasswordField('Repeat password:', validators=[DataRequired("Please repeat your password"), EqualTo('password'), Length(8, 20,"Length must be between 8-20 characters.")])
    submit = SubmitField('Register')