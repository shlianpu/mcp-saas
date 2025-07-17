from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class MCPProvider(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    endpoint = db.Column(db.String(500), nullable=False)
    schema = db.Column(db.JSON)  # Provider的Schema定义
    auth_config = db.Column(db.JSON)  # 认证配置
    status = db.Column(db.String(20), default='active')  # active, inactive
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<MCPProvider {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'endpoint': self.endpoint,
            'schema': self.schema,
            'auth_config': self.auth_config,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class MCPConsumer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    consumer_type = db.Column(db.String(50), nullable=False)  # aigc_copilot, external_ai, etc.
    config = db.Column(db.JSON)  # Consumer配置
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<MCPConsumer {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'consumer_type': self.consumer_type,
            'config': self.config,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class ContextEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_type = db.Column(db.String(100), nullable=False)  # page.updated, model.created, etc.
    source_id = db.Column(db.String(100), nullable=False)  # 事件源ID
    source_type = db.Column(db.String(50), nullable=False)  # page, model, workflow, etc.
    payload = db.Column(db.JSON)  # 事件载荷
    tenant_id = db.Column(db.String(100))  # 租户ID
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ContextEvent {self.event_type}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_type': self.event_type,
            'source_id': self.source_id,
            'source_type': self.source_type,
            'payload': self.payload,
            'tenant_id': self.tenant_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AIGCRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    request_type = db.Column(db.String(50), nullable=False)  # generate_page, generate_api, etc.
    input_prompt = db.Column(db.Text)
    context_data = db.Column(db.JSON)  # 注入的上下文数据
    output_result = db.Column(db.JSON)  # 生成结果
    model_used = db.Column(db.String(100))  # 使用的模型
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<AIGCRequest {self.request_type}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'request_type': self.request_type,
            'input_prompt': self.input_prompt,
            'context_data': self.context_data,
            'output_result': self.output_result,
            'model_used': self.model_used,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

