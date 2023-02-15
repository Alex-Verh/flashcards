from flask_wtf import FlaskForm
from wtforms.fields import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Length, EqualTo, Regexp, ValidationError


class LoginForm(FlaskForm):
    username = StringField('Username:', validators=[DataRequired("Please enter your username")])
    password = PasswordField('Password:', validators=[DataRequired("Please enter your password")])
    submit = SubmitField('Login')

    
class RegisterForm(FlaskForm):
    name = StringField('Name:', validators=[DataRequired("Please enter your name"), Regexp('^\w+$', message="Name must contain only letters or numbers"),  Length(3, 30,"Length must be between 3-30 characters")])
    username = StringField('Username:', validators=[DataRequired("Please enter your username"), Regexp('^\w+$', message="Username must contain only letters or numbers"),  Length(3, 15,"Length must be between 3-15 characters")])
    password = PasswordField('Password:', validators=[DataRequired("Please enter your password"), Regexp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{0,}$", message='Password must at least one uppercase letter, one lowercase letter, one number and one special character'), Length(8, 20,"Length must be between 8-20 characters")])
    password1 = PasswordField('Repeat password:', validators=[DataRequired("Please repeat your password"), EqualTo('password', "Passwords must match")])
    submit = SubmitField('Register')