from app.extensions import db

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(500), nullable=True)

    def __repr__(self):
        return f'<User "{self.title}">'