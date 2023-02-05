# Создание БД, установление и разрыв соединения при запросах

import sqlite3
import os
from flask import Flask, render_template, g, request, flash, abort


# Конфигурация
DATABASE = '/flsite.db'
DEBUG = True
SECRET_KEY = 'ddwdwj5438vzjk9rwdhfs'
USERNAME = 'admin'
PASSWORD = '123'

# Создаем само приложение и загружаем конфигурацию из текущего модуля:
app = Flask(__name__)
app.config.from_object(__name__)

# Переопределим в конфигурации значение DATABASE, расположив БД в текущем каталоге приложения:
app.config.update({'DATABASE': f'{os.path.join(app.root_path, "flsite.db")}'})
# или app.config.update(dict(DATABASE=os.path.join(app.root_path, 'flsite.db')))

def connect_db():
    # Создаём соединение с базой данных
    connection = sqlite3.connect(app.config['DATABASE'])
    # Задание представления записей из базы данных не в виде кортежей, а в виде словаря
    connection.row_factory = sqlite3.Row
    return connection

# Функция для создания начальной БД с небором необходимых таблиц
def create_db():
    """Вспомогательная функция для создания таблиц БД"""
    db = connect_db()
    # Открываем файл 'sq_db.sql' на чтение
    with app.open_resource('sq_db.sql', mode='r') as f:
    # with open('sq_db.sql', mode='r', encoding='utf-8') as f:
        # Для открытой БД выполняем скрипт, записанный в файле 'sq_db.sql
        db.cursor().executescript(f.read())
    # Вызываем метод commit, чтобы изменения применились к текущей БД
    db.commit()
    # Закрывам установленное соединение.
    db.close()


def get_db():
    '''Соединение с базой данных, если оно еще не установлено'''
    if not hasattr(g, 'link_db'):
        g.link_db = connect_db()
    return g.link_db
    
    
@app.route('/')
def index():
    # db = connect_db()
    dbase = FDataBase(get_db())
    return render_template('index.html', menu=dbase.getMenu(), title='Главная страница', posts=dbase.getPostsAnonce())

@app.route('/add_post', methods=['POST', 'GET'])
def add_post():
    dbase = FDataBase(get_db())
    if request.method == 'POST':
        post_name = request.form.get('name')
        post_content = request.form.get('post')
        
        if len(post_name) > 4 and len(post_content) > 10:
            result = dbase.addPost(post_name, post_content)
            if not result:
                flash('Ошибка добавления статьи', category = 'error')
            else:
                flash('Статья добавлена успешно', category='success')
        else:
            flash('Ошибка добавления статьи', category='error')
    return render_template('add_post.html', menu = dbase.getMenu(), title="Добавление статьи")


@app.route('/post/<int:post_id>')
def show_post(post_id):
    dbase = FDataBase(get_db())
    title, post_content = dbase.getPost(post_id)
    if not title:
        abort(404)
    return render_template('post.html', menu=dbase.getMenu(), title=title, post=post_content)
        
        
@app.errorhandler(404)
def page_not_found(error):
    dbase = FDataBase(get_db())
    return render_template('page404.html', title="Страница не найдена", menu=dbase.getMenu())

@app.teardown_appcontext
def close_db(error):
    '''Закрываем соединение с БД, если оно было установлено'''
    if hasattr(g, 'link_db'):
        g.link_db.close()


if __name__ == '__main__':
    app.run(debug=True)