from flask import Flask, request
import os

app = Flask(__name__)


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
