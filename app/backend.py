# @app.route('/post/<int:post_id>')
# def show_post(post_id):
#     dbase = FDataBase(get_db())
#     title, post_content = dbase.getPost(post_id)
#     if not title:
#         abort(404)
#     return render_template('post.html', menu=dbase.getMenu(), title=title, post=post_content)

# @app.teardown_appcontext
# def close_db(error):
#     '''Закрываем соединение с БД, если оно было установлено'''
#     if hasattr(g, 'link_db'):
#         g.link_db.close()

# if __name__ == '__main__':
#     app.run(debug=True)