# flask imports

from flask_cors import CORS
from utils import is_json ,email_check
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import uuid # for public id
from werkzeug.security import generate_password_hash, check_password_hash
# imports for PyJWT authentication
import jwt
import os
from datetime import datetime, timedelta
from functools import wraps

# creates Flask object
app = Flask(__name__)
# configuration
# NEVER HARDCODE YOUR CONFIGURATION IN YOUR CODE
# INSTEAD CREATE A .env FILE AND STORE IN IT
secret_key = os.environ.get('SECRET_KEY')
app.config['SECRET_KEY'] = secret_key if secret_key else "SupersecretSafeKey"
# database name
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Database.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})

# creates SQLALCHEMY object
db = SQLAlchemy(app)

# Database ORMs
class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    public_id = db.Column(db.String(50), unique = True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(70), unique = True)
    password = db.Column(db.String(80))
    todos = db.relationship('Todo', backref='user', lazy=True)


class Todo(db.Model):
    id = db.Column('todo_id', db.Integer, primary_key = True)
    title = db.Column(db.String(100))
    desc = db.Column(db.Text, nullable=True)
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    done = db.Column(db.Boolean,default=False, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.public_id'),
        nullable=False)
 
    def __init__(self, title:str, desc=''):
        self.title = title
        self.desc = desc
    def __repr__(self):
        return f'Todo: {self.title}'


# decorator for verifying the JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        authorization= request.headers.get('Authorization')
        token = authorization.split()[1] if authorization else None
        # return 401 if token is not passed
        if not token:
            return jsonify({'message' : 'Token is missing !!'}), 401

        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, app.config['SECRET_KEY'],algorithms=['HS256'])
            current_user = User.query\
				.filter_by(public_id = data['public_id'])\
				.first()
        except Exception as e:
            # print(e)
            return jsonify({
				'message' : 'Token is invalid !!'
			}), 401
		# returns the current logged in users contex to the routes
        return f(current_user, *args, **kwargs)

    return decorated

# User Database Route
# this route sends back list of users
@app.route('/user', methods =['GET'])
@token_required
def get_all_users(current_user):
    # print(current_user.id)
    # querying the database
    # for all the entries in it
    users = User.query.all()
    # converting the query objects
    # to list of jsons
    output = []
    for user in users:
        # appending the user data json
        # to the response list
        output.append({
            'public_id': user.public_id,
            'name' : user.name,
            'email' : user.email
        })

    return jsonify({'users': output})

# route for logging user in
@app.route('/login', methods =['POST'])
def login():
    # creates dictionary of json data
    data = request.json
    auth = data[0] if (data and isinstance(data, list)) else data

    if not auth or not auth.get('email') or not auth.get('password'):
        # returns 401 if any email or / and password is missing
        return make_response(
            {"email":"Required field","password":"Required field"},
            401,
            {'WWW-Authenticate' : 'Basic realm ="Login required !!"'}
        )

    user = User.query\
        .filter_by(email = auth.get('email'))\
        .first()

    if not user:
        # returns 401 if user does not exist
        return make_response(
            'Could not verify',
            401,
            {'WWW-Authenticate' : 'Basic realm ="User does not exist !!"'}
        )

    if check_password_hash(user.password, auth.get('password')):
        # print(user.todos)
        # generates the JWT Token
        token = jwt.encode({
            'public_id': user.public_id,
            'name': user.name,
            'exp' : datetime.utcnow() + timedelta(minutes = 30)
        }, app.config['SECRET_KEY'])

        return make_response(jsonify({'token' : token}), 201)
    # returns 403 if password is wrong
    return make_response(
        'Could not verify',
        403,
        {'WWW-Authenticate' : 'Basic realm ="Wrong Password !!"'}
    )

# signup route
@app.route('/signup', methods =['POST'])
def signup():
    # creates a dictionary of the form data
    # data = request.form

    data_j = request.json
    data = data_j[0] if (data_j and isinstance(data_j, list)) else data_j

    # gets name, email and password
    name, email, password = data.get('name'), data.get('email'), data.get('password')
    if not all([name, email_check(email), password]):
        
        return make_response(
            {"email": "Required field","name": "Required field","password": "Required field"},
            401,
            {'WWW-Authenticate' : 'Basic realm ="invalid required !!"'}
        )
    # checking for existing user
    user = User.query\
        .filter_by(email = email)\
        .first()
    if not user:
        # database ORM object
        user = User(
            public_id = str(uuid.uuid4()),
            name = name,
            email = email,
            password = generate_password_hash(password)
        )
        # insert user
        db.session.add(user)
        db.session.commit()

    if check_password_hash(user.password, password):
        # generates the JWT Token
        token = jwt.encode({
            'public_id': user.public_id,
            'name': user.name,
            'exp' : datetime.utcnow() + timedelta(minutes = 30)
        }, app.config['SECRET_KEY'])

        return make_response(jsonify({'token' : token,"message":"Successfully registered"}), 201)

    else:
        # returns 202 if user already exists
        return make_response('Something went wrong', 401)



@app.route('/todos/',methods=['POST','GET'])
@token_required
def all_todos(current_user):
    if request.method == 'GET':
        todos = Todo.query.filter_by(user_id = current_user.public_id).all()
        output = []
        for todo in todos:
            # appending the user data json
            # to the response list
            output.append({
                'id': todo.id,
                'title' : todo.title,
                'desc' : todo.desc,
                'date_added' : todo.date_added,
                'done' : todo.done,
            })
        # print(output)
        if not output:
            return make_response({"massage":'Add a new todo'}, 200)
        return  jsonify(output)

    if request.method == 'POST':
        data_j = request.json
        data = data_j[0] if (data_j and isinstance(data_j, list)) else data_j

        try:
            todo = Todo(**data)
            todo.user_id = current_user.public_id
            db.session.add(todo)
            db.session.commit()
        except Exception as e:
            # print(e)
            return {"title":'field is required',"desc":'field is required'}
       
        # appending the user data json
        # to the response list
        output = [{
            'id': todo.id,
            'title' : todo.title,
            'desc' : todo.desc,
            'date_added' : todo.date_added,
            'done' : todo.done,
            }]
        return jsonify(output)

@app.route('/todos/<id>',methods=['PUT','GET','DELETE'])
def todo(id):
    if request.method == 'GET':
        return  jsonify(Todo.query.get_or_404(id))

    if request.method == 'PUT':
        todo = Todo.query.get_or_404(id)
        for key,val in request.json.items():
            if hasattr(todo,key) and key not in ['id', 'date_added']:
                setattr(todo, key, val)
        db.session.commit()
        todo = [{
            'id': todo.id,
            'title' : todo.title,
            'desc' : todo.desc,
            'date_added' : todo.date_added,
            'done' : todo.done,
        }]
        return jsonify(todo)

    if request.method == 'DELETE':
        todo = Todo.query.get_or_404(id)
        db.session.delete(todo)
        db.session.commit()
        return f'DELETE id:{id} successfully'


if __name__ == "__main__":
	# setting debug to True enables hot reload
	# and also provides a debugger shell
	# if you hit an error while running the server
	app.run(debug = False)
