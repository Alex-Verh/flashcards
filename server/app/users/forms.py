from flask_wtf import FlaskForm
from wtforms.fields import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Length, EqualTo, Regexp, ValidationError, Email
from ..models import User


class LoginForm(FlaskForm):
    username = StringField('Username:', validators=[DataRequired("Please enter your username")])
    password = PasswordField('Password:', validators=[DataRequired("Please enter your password")])
    submit = SubmitField('Login')

class RegisterForm(FlaskForm):
    username = StringField('Username:', validators=[DataRequired("Please enter your username"), Regexp('^\w+$', message="Username must contain only letters or numbers"),  Length(3, 30, message="Length must be between 3-30 characters")])
    email = StringField('Email Address:', validators=[DataRequired("Please enter your email address"), Email("Enter valid email"), Length(3, 50, "Length must be between 3-50 characters.")])
    password = PasswordField('Password:', validators=[DataRequired("Please enter your password"), Regexp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{0,}$", message='Password must contain at least one uppercase letter, one lowercase letter, one number'), Length(8, 30,"Length must be between 8-30 characters")])
    password1 = PasswordField('Repeat password:', validators=[DataRequired("Please repeat your password"), EqualTo('password', "Passwords must match")])
    submit = SubmitField('Register')
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('User with this username already exists')
        
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError("User with such email already exists")
            