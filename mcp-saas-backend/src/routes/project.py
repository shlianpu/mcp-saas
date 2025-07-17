from flask import Blueprint, jsonify, request
from src.models.project import Project, Page, DataModel, Workflow, db
from src.models.mcp import ContextEvent

project_bp = Blueprint('project', __name__)

# 项目管理
@project_bp.route('/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    return jsonify([project.to_dict() for project in projects])

@project_bp.route('/projects', methods=['POST'])
def create_project():
    data = request.json
    project = Project(
        name=data['name'],
        description=data.get('description', ''),
        owner_id=data['owner_id'],
        config=data.get('config', {})
    )
    db.session.add(project)
    db.session.commit()
    return jsonify(project.to_dict()), 201

@project_bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify(project.to_dict())

@project_bp.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.json
    project.name = data.get('name', project.name)
    project.description = data.get('description', project.description)
    project.config = data.get('config', project.config)
    db.session.commit()
    return jsonify(project.to_dict())

@project_bp.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    project.status = 'deleted'
    db.session.commit()
    return '', 204

# 页面管理
@project_bp.route('/projects/<int:project_id>/pages', methods=['GET'])
def get_pages(project_id):
    pages = Page.query.filter_by(project_id=project_id).all()
    return jsonify([page.to_dict() for page in pages])

@project_bp.route('/projects/<int:project_id>/pages', methods=['POST'])
def create_page(project_id):
    data = request.json
    page = Page(
        project_id=project_id,
        name=data['name'],
        path=data['path'],
        dsl=data.get('dsl', {})
    )
    db.session.add(page)
    db.session.commit()
    
    # 触发MCP事件
    event = ContextEvent(
        event_type='page.created',
        source_id=str(page.id),
        source_type='page',
        payload={
            'page_id': page.id,
            'project_id': project_id,
            'name': page.name,
            'dsl': page.dsl
        },
        tenant_id=f'project_{project_id}'
    )
    db.session.add(event)
    db.session.commit()
    
    return jsonify(page.to_dict()), 201

@project_bp.route('/pages/<int:page_id>', methods=['PUT'])
def update_page(page_id):
    page = Page.query.get_or_404(page_id)
    data = request.json
    page.name = data.get('name', page.name)
    page.path = data.get('path', page.path)
    page.dsl = data.get('dsl', page.dsl)
    db.session.commit()
    
    # 触发MCP事件
    event = ContextEvent(
        event_type='page.updated',
        source_id=str(page.id),
        source_type='page',
        payload={
            'page_id': page.id,
            'project_id': page.project_id,
            'name': page.name,
            'dsl': page.dsl
        },
        tenant_id=f'project_{page.project_id}'
    )
    db.session.add(event)
    db.session.commit()
    
    return jsonify(page.to_dict())

# 数据模型管理
@project_bp.route('/projects/<int:project_id>/models', methods=['GET'])
def get_data_models(project_id):
    models = DataModel.query.filter_by(project_id=project_id).all()
    return jsonify([model.to_dict() for model in models])

@project_bp.route('/projects/<int:project_id>/models', methods=['POST'])
def create_data_model(project_id):
    data = request.json
    model = DataModel(
        project_id=project_id,
        name=data['name'],
        schema=data.get('schema', {})
    )
    db.session.add(model)
    db.session.commit()
    
    # 触发MCP事件
    event = ContextEvent(
        event_type='model.created',
        source_id=str(model.id),
        source_type='model',
        payload={
            'model_id': model.id,
            'project_id': project_id,
            'name': model.name,
            'schema': model.schema
        },
        tenant_id=f'project_{project_id}'
    )
    db.session.add(event)
    db.session.commit()
    
    return jsonify(model.to_dict()), 201

# 工作流管理
@project_bp.route('/projects/<int:project_id>/workflows', methods=['GET'])
def get_workflows(project_id):
    workflows = Workflow.query.filter_by(project_id=project_id).all()
    return jsonify([workflow.to_dict() for workflow in workflows])

@project_bp.route('/projects/<int:project_id>/workflows', methods=['POST'])
def create_workflow(project_id):
    data = request.json
    workflow = Workflow(
        project_id=project_id,
        name=data['name'],
        bpmn_xml=data.get('bpmn_xml', '')
    )
    db.session.add(workflow)
    db.session.commit()
    
    # 触发MCP事件
    event = ContextEvent(
        event_type='workflow.created',
        source_id=str(workflow.id),
        source_type='workflow',
        payload={
            'workflow_id': workflow.id,
            'project_id': project_id,
            'name': workflow.name,
            'bpmn_xml': workflow.bpmn_xml
        },
        tenant_id=f'project_{project_id}'
    )
    db.session.add(event)
    db.session.commit()
    
    return jsonify(workflow.to_dict()), 201

