from flask import Flask, request
import os
import pg8000

app = Flask(__name__)

dbconn = pg8000.connect(database=os.environ.get('DATABASE_NAME'), user=os.environ.get('DATABASE_USER'), host=os.environ.get('DATABASE_HOST'), port=int(os.environ.get('DATABASE_PORT', 5432)), password=os.environ.get('DATABASE_PASSWORD', ''))
dbcursor = dbconn.cursor()

@app.route('/dbtest')
def dbtest():
    return dbcursor.execute('Select * from test')

@app.route("/")
def hello():
    return "Hello World!"


@app.route("/login")
def login():
    pass


@app.route("/transactions")
def get_transactions():
    pass


@app.route("/user")
def get_user():
    user_id = request.args.get("user_id")


@app.route("/search")
def search():
    query = request.args.get("q")


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
