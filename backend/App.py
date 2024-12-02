import os
from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from waitress import serve

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
bcrypt = Bcrypt(app)
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

API_KEY = os.getenv("GIANT_BOMB_API_KEY")
BASE_URL = "https://www.giantbomb.com/api"

# In-memory storage for users and rentals
users = {
    "guest": bcrypt.generate_password_hash("guest").decode('utf-8')
}
rentals = {}

@app.route('/api/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400
    
    if username in users:
        return jsonify({"error": "Username already exists."}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users[username] = hashed_password
    return jsonify({"message": "User registered successfully."}), 201

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400
    
    user_password = users.get(username)
    if not user_password or not bcrypt.check_password_hash(user_password, password):
        return jsonify({"error": "Invalid username or password."}), 401
    
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

@app.route('/api/search', methods=['GET'])
@jwt_required()
def search_games():
    query = request.args.get('query')
    resources = request.args.get('resources', 'game')
    page = request.args.get('page', '1')
    
    if not query:
        return jsonify({"error": "Query parameter is required."}), 400
    
    params = {
        'api_key': API_KEY,
        'query': query,
        'resources': resources,
        'page': page,
        'format': 'json'
    }
    
    try:
        # response = requests.get(f"{BASE_URL}/search/", params=params)
        headers = {
            'User-Agent': 'game-rental',
        }
        response = requests.get(f"{BASE_URL}/search/", params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        return jsonify({
            'results': data['results'],
            'number_of_total_results': data['number_of_total_results']
        })
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/rent', methods=['POST'])
@jwt_required()
def rent_game():
    current_user = get_jwt_identity()
    game = request.json.get('game_id')
    
    if not game or 'id' not in game or 'name' not in game:
        return jsonify({"error": "Game details (ID and name) are required."}), 400
    
    if current_user not in rentals:
        rentals[current_user] = []
    
    rentals[current_user].append(game)
    return jsonify({"message": f"Game '{game['name']}' has been rented successfully by user {current_user}."}), 200

@app.route('/api/rentals', methods=['GET'])
@jwt_required()
def get_rentals():
    current_user = get_jwt_identity()
    user_rentals = rentals.get(current_user, [])
    return jsonify(user_rentals), 200

@app.route('/')
def home():
    return "Welcome to the Game Rental Application!"

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5000)