from flask import Flask, request, jsonify, make_response, abort
import os
import pg8000
import json

app = Flask(__name__)

dbconn = pg8000.connect(database=os.environ.get('DATABASE_NAME'), user=os.environ.get('DATABASE_USER'), host=os.environ.get('DATABASE_HOST'), port=int(os.environ.get('DATABASE_PORT', 5432)), password=os.environ.get('DATABASE_PASSWORD', ''))
dbcursor = dbconn.cursor()

@app.route('/dbtest')
def dbtest():
    return jsonify(dbcursor.execute('Select * from test').fetchall())

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    id, password = dbcursor.execute("SELECT user_id, password FROM users WHERE email = '{0}'".format(email)).fetchone()
    if request.form['password'] == password:
        resp = make_response('Login Successful')
        resp.set_cookie('x-uid', str(id))
        return resp
    else:
        abort(401)

@app.route('/signup', methods=['POST'])
def sign_up():
    email = request.form['email']
    result = dbcursor.execute("SELECT email FROM users WHERE email = '{0}'".format(email)).fetchone()
    if result: 
        abort(400)
    else:
        password = request.form['password']
        name = request.form['name']
        id = dbcursor.execute("INSERT INTO public.users(email, name, password) VALUES('{0}', '{1}', '{2}') RETURNING user_id".format(email, name, password)).fetchone()[0]
        dbconn.commit()
        resp = make_response('Sign-Up Successful')
        resp.set_cookie('x-uid', str(id))
        return resp

@app.route('/comments', methods=['POST'])
def add_comment():
    commentor = request.cookies.get('x-uid')
    if not commentor:
        abort(401)
    comment = request.form['comment']
    transaction = request.form['transaction_id']
    dbcursor.execute("INSERT INTO public.comments(commentor, transaction_id, comment_text) VALUES('{0}', '{1}', '{2}') RETURNING comment_text".format(commentor, transaction, comment)).fetchone()
    dbconn.commit()
    return "Comment Added"

@app.route('/reactions', methods=['POST'])
def add_reaction():
    reactor = request.cookies.get('x-uid')
    if not reactor:
        abort(401)
    reaction = request.form['reaction']
    transaction = request.form['transaction_id']
    dbcursor.execute("INSERT INTO public.reactions(reactor, transaction_id, reaction) VALUES('{0}', '{1}', '{2}') RETURNING reaction".format(reactor, transaction, reaction)).fetchone()
    dbconn.commit()
    return "Reaction Added"


@app.route("/insights")
def get_insights():
    user = request.cookies.get('x-uid')
    money_spent = dbcursor.execute("SELECT category, SUM(amount) FROM transactions WHERE user_id = {0} and date > CURRENT_DATE - interval '30 day' GROUP BY 1 \
                                    UNION ALL \
                                    SELECT 'total', SUM(amount) FROM transactions WHERE user_id = {0} and date > CURRENT_DATE - interval '30 day' \
                                    ".format(user)).fetchall()
    return money_spent


@app.route("/users")
def get_user():
    users = dbcursor.execute("SELECT DISTINCT user_id, name FROM users").fetchall()
    return users


@app.route("/follows", methods=['POST'])
def follow():
    user = request.cookies.get('x-uid')
    if not user:
        abort(401)
    followee = request.form['friend']
    followee_id = dbcursor.execute("SELECT user_id FROM users WHERE name = '{0}'".format(followee)).fetchone()[0]
    dbcursor.execute("INSERT INTO public.followers(follower, followee) VALUES({0}, {1}) RETURNING follower, followee".format(user, followee_id)).fetchone()[0]
    dbconn.commit()
    return "Now following {0}".format(followee)


# search user
# insights  - shameful dollars 

TRANSACTIONS_LOOKUP_SQL_FEED = 'SELECT t.t_id, t.user_id, u.name AS transactor_name, t.date, t.description, t.category, t.amount, NULL as reactor, NULL as reactor_name, NULL as reaction, c.commentor, uc.name, c.comment_text \
                            FROM transactions t \
                            JOIN users u ON t.user_id = u.user_id \
                            LEFT JOIN comments c ON c.transaction_id = t.t_id \
                            LEFT JOIN users uc ON uc.user_id = c.commentor \
                            WHERE t.user_id IN (SELECT followee FROM followers WHERE follower = {0}) \
                                OR t.user_id = {0}\
                            UNION ALL\
                            SELECT t.t_id, t.user_id, u.name AS transactor_name, t.date, t.description, t.category, t.amount, r.reactor, ur.name, r.reaction, NULL, NULL, NULL\
                            FROM transactions t \
                            JOIN users u ON t.user_id = u.user_id \
                            LEFT JOIN reactions r ON r.transaction_id = t.t_id \
                            LEFT JOIN users ur ON ur.user_id = r.reactor \
                            WHERE t.user_id IN (SELECT followee FROM followers WHERE follower = {0}) \
                                OR t.user_id = {0} \
                            ORDER BY t_id'

TRANSACTIONS_LOOKUP_SQL_USER = 'SELECT t.t_id, t.user_id, u.name AS transactor_name, t.date, t.description, t.category, t.amount, NULL as reactor, NULL as reactor_name, NULL as reaction, c.commentor, uc.name, c.comment_text \
                            FROM transactions t \
                            JOIN users u ON t.user_id = u.user_id \
                            LEFT JOIN comments c ON c.transaction_id = t.t_id \
                            LEFT JOIN users uc ON uc.user_id = c.commentor \
                            WHERE t.user_id {0}) \
                            UNION ALL\
                            SELECT t.t_id, t.user_id, u.name AS transactor_name, t.date, t.description, t.category, t.amount, r.reactor, ur.name, r.reaction, NULL, NULL, NULL\
                            FROM transactions t \
                            JOIN users u ON t.user_id = u.user_id \
                            LEFT JOIN reactions r ON r.transaction_id = t.t_id \
                            LEFT JOIN users ur ON ur.user_id = r.reactor \
                            WHERE t.user_id = {0} \
                            ORDER BY t_id'


def actually_get_transactions_for(uid, query):
    father_list = dbcursor.execute(query.format(uid)).fetchall()
    big_dict_energy = {}  

    for row in father_list:
        t_id, user_id, transactor_name, timestamp, description, category, amount, reactor, reactor_name, reaction, commentor, commentor_name, comment_text = row
        if t_id not in big_dict_energy: 
            big_dict_energy[t_id] = {"name": transactor_name, "price": float(amount), "timestamp": timestamp, "category": category, "comments": [], "reactions": []}
        if comment_text:
            big_dict_energy[t_id]["comments"].append({"commentor_name":commentor_name, "comment_text":comment_text})
        if reaction:
            big_dict_energy[t_id]["reactions"].append({"reactor_name":reactor_name, "reaction":reaction})
        
    return big_dict_energy

@app.route("/transactions")
def get_transactions():
    uid = request.cookies.get('x-uid')
    if not uid:
        uid = 1
    return actually_get_transactions_for(uid, TRANSACTIONS_LOOKUP_SQL_FEED)

@app.route("/transactions/<uid>")
def get_transactions_for(uid):
    return actually_get_transactions_for(uid, TRANSACTIONS_LOOKUP_SQL_USER)
                   

@app.route("/search")
def search():
    query = request.args.get("q")



if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
