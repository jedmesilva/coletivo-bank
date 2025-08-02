from flask import Blueprint, request, jsonify, session, render_template
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from models import User, Fund, Deposit, CapitalRequest, Debt
import logging
import os

# Configure Flask-Login
from flask_login import LoginManager
login_manager = LoginManager()
login_manager.init_app(app)
# login_manager.login_view = 'auth.login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Create blueprints
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
funds_bp = Blueprint('funds', __name__, url_prefix='/api/funds')
main_bp = Blueprint('main', __name__)

# Serve the React app
@main_bp.route('/')
def index():
    return app.send_static_file('index.html')

@main_bp.route('/<path:path>')
def serve_static(path):
    # Don't interfere with API routes
    if path.startswith('api/'):
        return jsonify({'error': 'API endpoint not found'}), 404
    try:
        return app.send_static_file(path)
    except:
        return app.send_static_file('index.html')

# Authentication routes
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        password_hash = generate_password_hash(password)
        user = User(username=username, email=email, password_hash=password_hash)
        
        db.session.add(user)
        db.session.commit()
        
        login_user(user)
        
        return jsonify({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'account_level': user.account_level
            }
        }), 201
        
    except Exception as e:
        logging.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Missing username or password'}), 400
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return jsonify({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'account_level': user.account_level
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/me')
@login_required
def get_current_user():
    return jsonify({
        'user': {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'account_level': current_user.account_level
        }
    }), 200

# Fund routes
@funds_bp.route('/', methods=['GET'])
@login_required
def get_funds():
    try:
        funds = Fund.query.filter_by(is_active=True).all()
        return jsonify({
            'funds': [{
                'id': fund.id,
                'name': fund.name,
                'description': fund.description,
                'target_amount': fund.target_amount,
                'current_amount': fund.current_amount,
                'creator_id': fund.creator_id,
                'created_at': fund.created_at.isoformat(),
                'is_active': fund.is_active
            } for fund in funds]
        }), 200
    except Exception as e:
        logging.error(f"Get funds error: {str(e)}")
        return jsonify({'error': 'Failed to fetch funds'}), 500

@funds_bp.route('/', methods=['POST'])
@login_required
def create_fund():
    try:
        data = request.get_json()
        name = data.get('name')
        description = data.get('description', '')
        target_amount = data.get('target_amount')
        
        if not name or not target_amount:
            return jsonify({'error': 'Missing required fields'}), 400
        
        fund = Fund(
            name=name,
            description=description,
            target_amount=float(target_amount),
            creator_id=current_user.id
        )
        
        db.session.add(fund)
        db.session.commit()
        
        return jsonify({
            'fund': {
                'id': fund.id,
                'name': fund.name,
                'description': fund.description,
                'target_amount': fund.target_amount,
                'current_amount': fund.current_amount,
                'creator_id': fund.creator_id,
                'created_at': fund.created_at.isoformat(),
                'is_active': fund.is_active
            }
        }), 201
        
    except Exception as e:
        logging.error(f"Create fund error: {str(e)}")
        return jsonify({'error': 'Failed to create fund'}), 500

@funds_bp.route('/<int:fund_id>/deposits', methods=['POST'])
@login_required
def create_deposit():
    try:
        data = request.get_json()
        amount = data.get('amount')
        fund_id = data.get('fund_id')
        
        if not amount or not fund_id:
            return jsonify({'error': 'Missing required fields'}), 400
        
        fund = Fund.query.get_or_404(fund_id)
        
        deposit = Deposit(
            amount=float(amount),
            user_id=current_user.id,
            fund_id=fund_id,
            status='confirmed'  # For now, we'll mark as confirmed immediately
        )
        
        # Update fund current amount
        fund.current_amount += float(amount)
        
        db.session.add(deposit)
        db.session.commit()
        
        return jsonify({
            'deposit': {
                'id': deposit.id,
                'amount': deposit.amount,
                'user_id': deposit.user_id,
                'fund_id': deposit.fund_id,
                'status': deposit.status,
                'created_at': deposit.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        logging.error(f"Create deposit error: {str(e)}")
        return jsonify({'error': 'Failed to create deposit'}), 500

# Register blueprints
app.register_blueprint(main_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(funds_bp)