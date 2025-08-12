from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Simple file-based storage
DATA_FILE = 'data.json'

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {'teams': [], 'products': []}

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/api/teams', methods=['GET'])
def get_teams():
    data = load_data()
    return jsonify(data['teams'])

@app.route('/api/teams', methods=['POST'])
def create_team():
    data = load_data()
    team_data = request.json
    team_id = len(data['teams']) + 1
    team = {
        'id': team_id,
        'name': team_data['name'],
        'city': team_data['city'],
        'state': team_data['state'],
        'members': [team_data['creator']],
        'orders': []
    }
    data['teams'].append(team)
    save_data(data)
    return jsonify(team), 201

@app.route('/api/teams/<int:team_id>/join', methods=['POST'])
def join_team(team_id):
    data = load_data()
    farmer_name = request.json['farmer_name']
    
    for team in data['teams']:
        if team['id'] == team_id:
            if farmer_name not in team['members']:
                team['members'].append(farmer_name)
                save_data(data)
            return jsonify(team)
    
    return jsonify({'error': 'Team not found'}), 404

@app.route('/api/products', methods=['GET'])
def get_products():
    products = [
        {'id': 1, 'name': 'Organic Pesticide', 'price': 120, 'bulk_price': 95, 'category': 'Pesticides'},
        {'id': 2, 'name': 'Chemical Pesticide', 'price': 80, 'bulk_price': 65, 'category': 'Pesticides'},
        {'id': 3, 'name': 'NPK Fertilizer', 'price': 150, 'bulk_price': 120, 'category': 'Fertilizers'},
        {'id': 4, 'name': 'Organic Compost', 'price': 100, 'bulk_price': 80, 'category': 'Fertilizers'},
        {'id': 5, 'name': 'Wheat Seeds', 'price': 60, 'bulk_price': 48, 'category': 'Seeds'},
        {'id': 6, 'name': 'Rice Seeds', 'price': 70, 'bulk_price': 56, 'category': 'Seeds'},
        {'id': 7, 'name': 'Corn Seeds', 'price': 55, 'bulk_price': 44, 'category': 'Seeds'},
        {'id': 8, 'name': 'Irrigation Pipes', 'price': 200, 'bulk_price': 160, 'category': 'Equipment'},
        {'id': 9, 'name': 'Sprinkler System', 'price': 300, 'bulk_price': 240, 'category': 'Equipment'},
        {'id': 10, 'name': 'Farm Tools Set', 'price': 180, 'bulk_price': 144, 'category': 'Tools'},
        {'id': 11, 'name': 'Soil Testing Kit', 'price': 90, 'bulk_price': 72, 'category': 'Testing'},
        {'id': 12, 'name': 'Weather Monitor', 'price': 250, 'bulk_price': 200, 'category': 'Technology'}
    ]
    return jsonify(products)

@app.route('/api/teams/<int:team_id>/order', methods=['POST'])
def create_order(team_id):
    data = load_data()
    order_data = request.json
    
    for team in data['teams']:
        if team['id'] == team_id:
            order = {
                'id': len(team['orders']) + 1,
                'product_id': order_data['product_id'],
                'quantity': order_data['quantity'],
                'farmer': order_data['farmer'],
                'status': 'pending'
            }
            team['orders'].append(order)
            save_data(data)
            return jsonify(order), 201
    
    return jsonify({'error': 'Team not found'}), 404

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = ['Pesticides', 'Fertilizers', 'Seeds', 'Equipment', 'Tools', 'Testing', 'Technology']
    return jsonify(categories)

@app.route('/api/teams/<int:team_id>/orders', methods=['GET'])
def get_team_orders(team_id):
    data = load_data()
    for team in data['teams']:
        if team['id'] == team_id:
            return jsonify(team['orders'])
    return jsonify({'error': 'Team not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)