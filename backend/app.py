from flask import Flask, request, jsonify, make_response, abort
from flask_cors import CORS, cross_origin

import os
import pg8000
import plaid
import datetime
import json

import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="https://d216d7ca6b11477bab15aef914c89602@sentry.io/2383148",
    integrations=[FlaskIntegration()]
)

app = Flask(__name__, static_folder='web', static_url_path='')
cors = CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

dbconn = pg8000.connect(database=os.environ.get('DATABASE_NAME'), user=os.environ.get('DATABASE_USER'), host=os.environ.get(
    'DATABASE_HOST'), port=int(os.environ.get('DATABASE_PORT', 5432)), password=os.environ.get('DATABASE_PASSWORD', ''))


@app.route('/dbtest')
def dbtest():
    return jsonify(dbconn.run('Select * from test'))


@app.route("/")
def hello():
    return app.send_static_file('index.html')


@app.route("/profile")
def profile():
    return app.send_static_file('index.html')


@app.route("/feed")
def feed():
    return app.send_static_file('index.html')


@app.route("/insights")
def insights():
    return app.send_static_file('index.html')


@app.route("/auth")
def auth():
    return app.send_static_file('index.html')


@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    db_response = dbconn.run(
        "SELECT user_id, password FROM users WHERE email = :email", email=email)
    print(db_response)
    if db_response:
        id, password = db_response[0]
    else:
        abort(401)
    if request.json['password'] == password:
        resp = make_response('Login successful!')
        resp.set_cookie('x-uid', str(id))
        return resp
    else:
        abort(401)


@app.route('/signup', methods=['POST'])
def sign_up():
    email = request.json['email']
    result = dbconn.run(
        "SELECT email FROM users WHERE email = :email", email=email)
    if result:
        abort(400)
    else:
        password = request.json['password']
        name = request.json['name']
        id = dbconn.run("INSERT INTO public.users(email, name, password) VALUES(:email, :name, :password) RETURNING user_id",
                        email=email, name=name, password=password)
        dbconn.commit()
        resp = make_response('Sign-Up Successful')
        resp.set_cookie('x-uid', str(id))
        return resp


@app.route('/comments', methods=['POST'])
def add_comment():
    commentor = request.cookies.get('x-uid')
    if not commentor:
        abort(401)
    comment = request.json['comment']
    transaction = request.json['transaction_id']
    dbconn.run("INSERT INTO public.comments(commentor, transaction_id, comment_text) VALUES(:commentor, :transaction, :comment) RETURNING comment_text",
               commentor=commentor, transaction=transaction, comment=comment)
    dbconn.commit()
    return "Comment Added"


@app.route('/reactions', methods=['POST'])
def add_reaction():
    reactor = request.cookies.get('x-uid')
    if not reactor:
        abort(401)
    reaction = request.json['reaction']
    transaction = request.json['transaction_id']
    dbconn.run("INSERT INTO public.reactions(reactor, transaction_id, reaction) VALUES(:reactor, :transaction, :reaction) RETURNING reaction",
               reactor=reactor, transaction=transaction, reaction=reaction)
    dbconn.commit()
    return "Reaction Added"


@app.route("/total_spent")
def total_spent():
    user = request.cookies.get('x-uid')
    if not user:
        abort(401)
    res = dbconn.run(
        "SELECT SUM(amount) FROM transactions WHERE user_id = :user and date > CURRENT_DATE - interval '30 day' ", user=user)
    row = res[0]
    total = row[0]
    print(total)
    if total == None:
        total = 0
    return json.dumps({"total": float(total)})


@app.route("/categories_spent")
def categories_spent():
    user = request.cookies.get('x-uid')
    spent_list = dbconn.run(
        "SELECT category, SUM(amount) as total FROM transactions WHERE user_id = :user and date > CURRENT_DATE - interval '30 day' GROUP BY 1 ", user=user)
    total = [{"category": row[0], "total": row[1]} for row in spent_list]
    return jsonify(total)


@app.route("/users")
def get_user():
    uid = request.cookies.get('x-uid')
    if uid:
        users = dbconn.run(
            "SELECT DISTINCT user_id, name FROM users WHERE user_id != :uid", uid=uid)
    else:
        users = dbconn.run(
            "SELECT DISTINCT user_id, name FROM users")
    user_list = []
    for row in users:
        my_dict = {"id": row[0], "name": row[1]}
        user_list.append(my_dict)
    return jsonify(user_list)


@app.route("/follows", methods=['POST'])
def follow():
    user = request.cookies.get('x-uid')
    if not user:
        abort(401)
    followee = request.json['fid']
    dbconn.run("INSERT INTO public.followers(follower, followee) VALUES(:user, :followee) RETURNING follower, followee",
               user=user, followee=followee)
    dbconn.commit()
    return "Now following {0}".format(followee)


# search user
# insights  - shameful dollars

TRANSACTIONS_LOOKUP_SQL_FEED = 'SELECT t.t_id, t.user_id, u.name AS transactor_name, t.date, t.description, t.category, t.amount, NULL as reactor, NULL as reactor_name, NULL as reaction, c.commentor, uc.name, c.comment_text \
                            FROM transactions t \
                            JOIN users u ON t.user_id = u.user_id \
                            LEFT JOIN comments c ON c.transaction_id = t.t_id \
                            LEFT JOIN users uc ON uc.user_id = c.commentor \
                            WHERE t.user_id IN (SELECT followee FROM followers WHERE follower = :uid) \
                                OR t.user_id = :uid\
                            UNION ALL\
                            SELECT t.t_id, t.user_id, u.name AS transactor_name, t.date, t.description, t.category, t.amount, r.reactor, ur.name, r.reaction, NULL, NULL, NULL\
                            FROM transactions t \
                            JOIN users u ON t.user_id = u.user_id \
                            LEFT JOIN reactions r ON r.transaction_id = t.t_id \
                            LEFT JOIN users ur ON ur.user_id = r.reactor \
                            WHERE t.user_id IN (SELECT followee FROM followers WHERE follower = :uid) \
                                OR t.user_id = :uid \
                            ORDER BY t_id'

TRANSACTIONS_LOOKUP_SQL_USER = 'SELECT t.t_id, t.user_id, u.name AS transactor_name, t.date, t.description, t.category, t.amount, NULL as reactor, NULL as reactor_name, NULL as reaction, c.commentor, uc.name, c.comment_text \
                            FROM transactions t \
                            JOIN users u ON t.user_id = u.user_id \
                            LEFT JOIN comments c ON c.transaction_id = t.t_id \
                            LEFT JOIN users uc ON uc.user_id = c.commentor \
                            WHERE t.user_id = :uid) \
                            UNION ALL\
                            SELECT t.t_id, t.user_id, u.name AS transactor_name, t.date, t.description, t.category, t.amount, r.reactor, ur.name, r.reaction, NULL, NULL, NULL\
                            FROM transactions t \
                            JOIN users u ON t.user_id = u.user_id \
                            LEFT JOIN reactions r ON r.transaction_id = t.t_id \
                            LEFT JOIN users ur ON ur.user_id = r.reactor \
                            WHERE t.user_id = :uid \
                            ORDER BY t_id'


def actually_get_transactions_for(uid, query):
    father_list = dbconn.run(query, uid=uid)
    big_dict_energy = {}

    for row in father_list:
        t_id, user_id, transactor_name, timestamp, description, category, amount, reactor, reactor_name, reaction, commentor, commentor_name, comment_text = row
        if t_id not in big_dict_energy:
            big_dict_energy[t_id] = {"name": transactor_name, "price": float(
                amount), "timestamp": timestamp, "category": category, "description": description, "comments": [], "reactions": []}
        if comment_text:
            big_dict_energy[t_id]["comments"].append(
                {"commentor_name": commentor_name, "comment_text": comment_text})
        if reaction:
            big_dict_energy[t_id]["reactions"].append(
                {"reactor_name": reactor_name, "reaction": reaction})
    return jsonify([dict(v, t_id=k) for k, v in big_dict_energy.items()])


@app.route("/transactions", methods=['GET'])
def get_transactions():
    uid = request.cookies.get('x-uid')
    if uid:
        print("Requested while logged in!")
    if not uid:
        uid = 1
        print("Requested while not logged in :(")
    return actually_get_transactions_for(uid, TRANSACTIONS_LOOKUP_SQL_FEED)


@app.route("/transactions/<uid>")
def get_transactions_for(uid):
    return actually_get_transactions_for(uid, TRANSACTIONS_LOOKUP_SQL_USER)


@app.route("/search")
def search():
    query = request.args.get("q")


PLAID_CLIENT_ID = "5e3e3e605947080013c2a414"
# sandbox:
PLAID_SECRET = "4646889beb65f71925ee3d12a218fa"
# development:
# PLAID_SECRET = "df9699ea7bbe1b6f3789c51fe83ec9"
PLAID_PUBLIC_KEY = "b1ede095e08a4bf8d26515ed4fe3b2"
PLAID_PRODUCTS = "transactions"
PLAID_COUNTRY_CODES = "US, CA, GB, FR, ES"
# PLAID_ENV = "development"
PLAID_ENV = "sandbox"


client = plaid.Client(client_id=PLAID_CLIENT_ID, secret=PLAID_SECRET,
                      public_key=PLAID_PUBLIC_KEY, environment=PLAID_ENV, api_version='2019-05-29')

access_token = None
public_token = None


@app.route("/get_access_token", methods=['POST'])
def get_access_token():
    global access_token
    uid = request.cookies.get('x-uid')

    public_token = request.json['public_token']
    bank_name = request.json['bank_name']
    # print("public token", public_token)
    exchange_response = client.Item.public_token.exchange(public_token)
    # print('access token: ' + exchange_response['access_token'])
    # print('item ID: ' + exchange_response['item_id'])

    access_token = exchange_response['access_token']
    item_id = exchange_response['item_id']

    # account_id is actually item_id lol
    INSERT_ACCESS_TOKEN_SQL = "INSERT into public.plaid_access_tokens(user_id, token, account_id, bank_name) VALUES(:uid, :access_token, :item_id, :bank_name)"

    dbconn.run(INSERT_ACCESS_TOKEN_SQL, uid=uid,
               access_token=access_token, item_id=item_id, bank_name=bank_name)
    dbconn.commit()

    # print("access_token", access_token)

    plaid_transactions = get_plaid_transactions()

    return plaid_transactions

    # return jsonify(exchange_response)


# @cross_origin()
def get_plaid_transactions():
    # Pull transactions for the last 30 days
    start_date = '{:%Y-%m-%d}'.format(datetime.datetime.now() +
                                      datetime.timedelta(-30))
    end_date = '{:%Y-%m-%d}'.format(datetime.datetime.now())
    try:
        transactions_response = client.Transactions.get(
            access_token, start_date, end_date)
    except plaid.errors.PlaidError as e:
        return jsonify(e)

    # pretty_print_response(transactions_response)

    return jsonify({'error': None, 'transactions': transactions_response['transactions']})


@app.route("/store_plaid_transactions", methods=['POST'])
def store_shameful_plaid_transactions():
    uid = request.cookies.get('x-uid')

    transactions = request.json["transactions"]
    for transaction in transactions:
        STORE_PLAID_TRANSACTIONS_SQL = "INSERT into public.transactions(user_id, date, description, category, amount) VALUES(:user_id, :date, :description, :category, :amount)"

        dbconn.run(STORE_PLAID_TRANSACTIONS_SQL, uid=uid,
                   date=transaction['date'], description=transaction['name'], category=transaction['category'][0], amount=transaction['amount'])
        dbconn.commit()

    return make_response("Added transactions")


@app.route("/get_connected_accounts", methods=['GET'])
def get_connected_accounts():
    uid = request.cookies.get('x-uid')

    accounts = dbconn.run(
        "SELECT DISTINCT bank_name FROM plaid_access_tokens WHERE user_id = :uid", uid=uid)

    account_list = []
    for row in accounts:
        account_list.append(row[0])
    return jsonify(account_list)


def pretty_print_response(response):
    print(json.dumps(response, indent=2, sort_keys=True))


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='localhost', port=port)
