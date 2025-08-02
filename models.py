from app import db
from flask_login import UserMixin
from datetime import datetime
from sqlalchemy import func

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # ensure password hash field has length of at least 256
    password_hash = db.Column(db.String(256))
    account_level = db.Column(db.String(20), default='bronze')  # bronze, silver, gold, platinum
    created_at = db.Column(db.DateTime, default=func.now())
    
    # Relationships
    funds = db.relationship('Fund', backref='creator', lazy=True)
    deposits = db.relationship('Deposit', backref='user', lazy=True)
    debts = db.relationship('Debt', backref='user', lazy=True)
    
    def __init__(self, username, email, password_hash, account_level='bronze'):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.account_level = account_level

class Fund(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    target_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, default=0.0)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    deposits = db.relationship('Deposit', backref='fund', lazy=True)
    capital_requests = db.relationship('CapitalRequest', backref='fund', lazy=True)
    
    def __init__(self, name, target_amount, creator_id, description='', current_amount=0.0, is_active=True):
        self.name = name
        self.description = description
        self.target_amount = target_amount
        self.current_amount = current_amount
        self.creator_id = creator_id
        self.is_active = is_active

class Deposit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    fund_id = db.Column(db.Integer, db.ForeignKey('fund.id'), nullable=False)
    transaction_id = db.Column(db.String(100))  # Asaas transaction ID
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, failed
    created_at = db.Column(db.DateTime, default=func.now())
    
    def __init__(self, amount, user_id, fund_id, status='pending', transaction_id=None):
        self.amount = amount
        self.user_id = user_id
        self.fund_id = fund_id
        self.status = status
        self.transaction_id = transaction_id

class CapitalRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    fund_id = db.Column(db.Integer, db.ForeignKey('fund.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    created_at = db.Column(db.DateTime, default=func.now())
    approved_at = db.Column(db.DateTime)
    approved_by = db.Column(db.Integer, db.ForeignKey('user.id'))

class Debt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    capital_request_id = db.Column(db.Integer, db.ForeignKey('capital_request.id'))
    status = db.Column(db.String(20), default='active')  # active, paid, overdue
    due_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=func.now())
    paid_at = db.Column(db.DateTime)