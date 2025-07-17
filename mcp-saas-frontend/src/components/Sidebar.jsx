import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { 
  Home, 
  FolderOpen, 
  Database, 
  Workflow, 
  Bot, 
  Settings, 
  Users,
  BarChart3,
  Layers,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: '仪表盘', icon: Home },
  { 
    id: 'projects', 
    label: '项目管理', 
    icon: FolderOpen,
    children: [
      { id: 'project-list', label: '项目列表' },
      { id: 'create-project', label: '创建项目' }
    ]
  },
  { 
    id: 'design', 
    label: '设计工具', 
    icon: Layers,
    children: [
      { id: 'page-designer', label: '页面设计器' },
      { id: 'form-builder', label: '表单构建器' },
      { id: 'workflow-designer', label: '流程设计器' }
    ]
  },
  { id: 'data-models', label: '数据模型', icon: Database },
  { id: 'workflows', label: '工作流', icon: Workflow },
  { 
    id: 'aigc', 
    label: 'AIGC Copilot', 
    icon: Bot,
    children: [
      { id: 'aigc-requests', label: '生成请求' },
      { id: 'aigc-history', label: '历史记录' }
    ]
  },
  { 
    id: 'mcp', 
    label: 'MCP 管理', 
    icon: BarChart3,
    children: [
      { id: 'providers', label: 'Context Providers' },
      { id: 'consumers', label: 'Context Consumers' },
      { id: 'events', label: '事件监控' }
    ]
  },
  { id: 'users', label: '用户管理', icon: Users },
  { id: 'settings', label: '系统设置', icon: Settings }
]

export default function Sidebar({ activeItem, onItemClick, isOpen }) {
  const [expandedItems, setExpandedItems] = useState(['projects', 'design'])

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const isActive = activeItem === item.id
    const Icon = item.icon

    return (
      <div key={item.id}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start mb-1 ${level > 0 ? 'ml-4 w-[calc(100%-1rem)]' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else {
              onItemClick(item.id)
            }
          }}
        >
          {Icon && <Icon className="h-4 w-4 mr-2" />}
          <span className="flex-1 text-left">{item.label}</span>
          {hasChildren && (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-0 lg:w-64'
    } overflow-hidden`}>
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>
      </div>
    </aside>
  )
}

