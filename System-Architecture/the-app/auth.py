from flask import Blueprint, request, jsonify
from . import db
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'patient')
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'email exists'}), 400
    user = User(email=email, password_hash=generate_password_hash(password), role=role)
    db.session.add(user)
    db.session.commit()
    return jsonify({'id': user.id, 'email': user.email}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error':'invalid credentials'}), 401
    token = 'jwt-token-placeholder'
    return jsonify({'access_token': token}), 200
