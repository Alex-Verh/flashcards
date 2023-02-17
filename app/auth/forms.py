from flask_wtf import FlaskForm
from wtforms.fields import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Length, EqualTo, Regexp, ValidationError
from app.models import User

class LoginForm(FlaskForm):
    username = StringField('Username:', validators=[DataRequired("Please enter your username")])
    password = PasswordField('Password:', validators=[DataRequired("Please enter your password")])
    submit = SubmitField('Login')

    
class RegisterForm(FlaskForm):
    name = StringField('Name:', validators=[DataRequired("Please enter your name"), Regexp("^[A-Za-z ,.'-]+$", message="Name contains invalid symbols"),  Length(3, 30, message="Length must be between 3-30 characters")])
    username = StringField('Username:', validators=[DataRequired("Please enter your username"), Regexp('^\w+$', message="Username must contain only letters or numbers"),  Length(3, 30, message="Length must be between 3-30 characters")])
    password = PasswordField('Password:', validators=[DataRequired("Please enter your password"), Regexp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{0,}$", message='Password must contain at least one uppercase letter, one lowercase letter, one number'), Length(8, 30,"Length must be between 8-30 characters")])
    password1 = PasswordField('Repeat password:', validators=[DataRequired("Please repeat your password"), EqualTo('password', "Passwords must match")])
    submit = SubmitField('Register')
    
    def validate_username(self, username):
        existing_user_name = User.query.filter_by(username=username.data).first()
        if existing_user_name:
            raise ValidationError('User with this username already exists')