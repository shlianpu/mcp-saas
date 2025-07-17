from flask import Blueprint, jsonify, request
from src.models.mcp import MCPProvider, MCPConsumer, ContextEvent, AIGCRequest, db
import json

mcp_bp = Blueprint('mcp', __name__)

# MCP Provider管理
@mcp_bp.route('/providers', methods=['GET'])
def get_providers():
    providers = MCPProvider.query.filter_by(status='active').all()
    return jsonify([provider.to_dict() for provider in providers])

@mcp_bp.route('/providers', methods=['POST'])
def create_provider():
    data = request.json
    provider = MCPProvider(
        name=data['name'],
        description=data.get('description', ''),
        endpoint=data['endpoint'],
        schema=data.get('schema', {}),
        auth_config=data.get('auth_config', {})
    )
    db.session.add(provider)
    db.session.commit()
    return jsonify(provider.to_dict()), 201

@mcp_bp.route('/providers/<int:provider_id>', methods=['GET'])
def get_provider(provider_id):
    provider = MCPProvider.query.get_or_404(provider_id)
    return jsonify(provider.to_dict())

@mcp_bp.route('/providers/<int:provider_id>', methods=['PUT'])
def update_provider(provider_id):
    provider = MCPProvider.query.get_or_404(provider_id)
    data = request.json
    provider.name = data.get('name', provider.name)
    provider.description = data.get('description', provider.description)
    provider.endpoint = data.get('endpoint', provider.endpoint)
    provider.schema = data.get('schema', provider.schema)
    provider.auth_config = data.get('auth_config', provider.auth_config)
    db.session.commit()
    return jsonify(provider.to_dict())

# MCP Consumer管理
@mcp_bp.route('/consumers', methods=['GET'])
def get_consumers():
    consumers = MCPConsumer.query.filter_by(status='active').all()
    return jsonify([consumer.to_dict() for consumer in consumers])

@mcp_bp.route('/consumers', methods=['POST'])
def create_consumer():
    data = request.json
    consumer = MCPConsumer(
        name=data['name'],
        description=data.get('description', ''),
        consumer_type=data['consumer_type'],
        config=data.get('config', {})
    )
    db.session.add(consumer)
    db.session.commit()
    return jsonify(consumer.to_dict()), 201

# Context事件管理
@mcp_bp.route('/events', methods=['GET'])
def get_events():
    tenant_id = request.args.get('tenant_id')
    event_type = request.args.get('event_type')
    limit = int(request.args.get('limit', 50))
    
    query = ContextEvent.query
    if tenant_id:
        query = query.filter_by(tenant_id=tenant_id)
    if event_type:
        query = query.filter_by(event_type=event_type)
    
    events = query.order_by(ContextEvent.created_at.desc()).limit(limit).all()
    return jsonify([event.to_dict() for event in events])

@mcp_bp.route('/events', methods=['POST'])
def create_event():
    data = request.json
    event = ContextEvent(
        event_type=data['event_type'],
        source_id=data['source_id'],
        source_type=data['source_type'],
        payload=data.get('payload', {}),
        tenant_id=data.get('tenant_id')
    )
    db.session.add(event)
    db.session.commit()
    return jsonify(event.to_dict()), 201

# AIGC请求管理
@mcp_bp.route('/aigc/requests', methods=['GET'])
def get_aigc_requests():
    user_id = request.args.get('user_id')
    status = request.args.get('status')
    limit = int(request.args.get('limit', 20))
    
    query = AIGCRequest.query
    if user_id:
        query = query.filter_by(user_id=user_id)
    if status:
        query = query.filter_by(status=status)
    
    requests = query.order_by(AIGCRequest.created_at.desc()).limit(limit).all()
    return jsonify([req.to_dict() for req in requests])

@mcp_bp.route('/aigc/requests', methods=['POST'])
def create_aigc_request():
    data = request.json
    aigc_request = AIGCRequest(
        user_id=data['user_id'],
        request_type=data['request_type'],
        input_prompt=data['input_prompt'],
        context_data=data.get('context_data', {}),
        model_used=data.get('model_used', 'gpt-4')
    )
    db.session.add(aigc_request)
    db.session.commit()
    
    # 这里可以添加异步处理逻辑
    # 模拟AIGC处理
    if aigc_request.request_type == 'generate_page':
        # 模拟生成页面DSL
        result = {
            'type': 'page',
            'components': [
                {
                    'type': 'header',
                    'props': {'title': '生成的页面标题'}
                },
                {
                    'type': 'form',
                    'props': {
                        'fields': [
                            {'name': 'name', 'type': 'text', 'label': '姓名'},
                            {'name': 'email', 'type': 'email', 'label': '邮箱'}
                        ]
                    }
                }
            ]
        }
        aigc_request.output_result = result
        aigc_request.status = 'completed'
        from datetime import datetime
        aigc_request.completed_at = datetime.utcnow()
        db.session.commit()
    
    return jsonify(aigc_request.to_dict()), 201

@mcp_bp.route('/aigc/requests/<int:request_id>', methods=['GET'])
def get_aigc_request(request_id):
    aigc_request = AIGCRequest.query.get_or_404(request_id)
    return jsonify(aigc_request.to_dict())

# MCP Router - 上下文聚合接口
@mcp_bp.route('/context/aggregate', methods=['POST'])
def aggregate_context():
    """聚合指定租户和事件类型的上下文信息"""
    data = request.json
    tenant_id = data.get('tenant_id')
    event_types = data.get('event_types', [])
    limit = data.get('limit', 10)
    
    contexts = []
    
    for event_type in event_types:
        events = ContextEvent.query.filter_by(
            tenant_id=tenant_id,
            event_type=event_type
        ).order_by(ContextEvent.created_at.desc()).limit(limit).all()
        
        for event in events:
            contexts.append({
                'type': event.event_type,
                'source': event.source_type,
                'data': event.payload,
                'timestamp': event.created_at.isoformat()
            })
    
    return jsonify({
        'tenant_id': tenant_id,
        'contexts': contexts,
        'total': len(contexts)
    })

# 健康检查
@mcp_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'mcp-router',
        'version': '1.0.0'
    })

