from flask import Flask, request, jsonify
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


@app.route("/login")
def login():
    pass


@app.route("/transactions")
def get_transactions():
    father_list = dbcursor.execute('SELECT t.t_id, t.user_id, u.name AS transactor_name, t.date, t.description, t.category, t.amount, NULL as reactor, NULL as reactor_name, NULL as reaction, c.commentor, uc.name, c.comment_text \
                                    FROM transactions t \
                                    JOIN users u ON t.user_id = u.user_id \
                                    LEFT JOIN comments c ON c.transaction_id = t.t_id \
                                    LEFT JOIN users uc ON uc.user_id = c.commentor \
                                    WHERE t.user_id IN (SELECT followee FROM followers WHERE follower = 2) \
                                        OR t.user_id = 2\
                                    UNION ALL\
                                    SELECT t.t_id, t.user_id, u.name AS transactor_name, t.date, t.description, t.category, t.amount, r.reactor, ur.name, r.reaction, NULL, NULL, NULL\
                                    FROM transactions t \
                                    JOIN users u ON t.user_id = u.user_id \
                                    LEFT JOIN reactions r ON r.transaction_id = t.t_id \
                                    LEFT JOIN users ur ON ur.user_id = r.reactor \
                                    WHERE t.user_id IN (SELECT followee FROM followers WHERE follower = 2) \
                                        OR t.user_id = 2\
                                    ORDER BY t_id').fetchall()
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
                   

@app.route("/user")
def get_user():
    user_id = request.args.get("user_id")


@app.route("/search")
def search():
    query = request.args.get("q")


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
