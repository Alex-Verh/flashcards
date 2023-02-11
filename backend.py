# Создание БД, установление и разрыв соединения при запросах

import sqlite3
import os
from flask import Flask, render_template, g, request, flash, abort

# Конфигурация
DEBUG = True
SECRET_KEY = 'ddwdwj5438vzjk9rwdhfs'


app = Flask(__name__)
app.config.from_object(__name__)

    
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/help')
def help():
    return render_template('help.html')


@app.route('/contact', methods=['POST', 'GET'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        title = request.form.get('title')
        message = request.form.get('message')
        
        if email.endswith('gmail.com'):
            
            flash('Success', category='success')
        else:
            flash('Error', category = 'error')
    return render_template('contact.html')


@app.route('/login', methods=['POST', 'GET'])
def login():
    return render_template('login.html')


@app.route('/register', methods=['POST', 'GET'])
def register():
    return render_template('register.html')


# @app.route('/post/<int:post_id>')
# def show_post(post_id):
#     dbase = FDataBase(get_db())
#     title, post_content = dbase.getPost(post_id)
#     if not title:
#         abort(404)
#     return render_template('post.html', menu=dbase.getMenu(), title=title, post=post_content)
        
        
@app.errorhandler(404)
def page_not_found(error):
    return render_template('index.html', message='Page not found')


# @app.teardown_appcontext
# def close_db(error):
#     '''Закрываем соединение с БД, если оно было установлено'''
#     if hasattr(g, 'link_db'):
#         g.link_db.close()


if __name__ == '__main__':
    app.run(debug=True)