from flask_wtf import FlaskForm
from wtforms.fields import StringField, SubmitField, BooleanField, PasswordField
from wtforms.validators import DataRequired, Email, Length, EqualTo


class LoginForm(FlaskForm):
    username = StringField('Username:', validators=[DataRequired(), Length(3)])
    password = PasswordField('Password:', validators=[DataRequired()])
    submit = SubmitField('Login')

    
class RegisterForm(FlaskForm):
    name = StringField('Name:', validators=[DataRequired()])
    username = StringField('Username:', validators=[DataRequired()])
    password = PasswordField('Password:', validators=[DataRequired()])
    password1 = PasswordField('Repeat password:', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')