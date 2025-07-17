import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { 
  FolderOpen, 
  Plus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx'

export default function ProjectList({ onNavigate }) {
  const [projects, setProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      // 使用模拟数据
      setProjects([
        {
          id: 1,
          name: '客户管理系统',
          description: '完整的客户关系管理系统，包含客户信息、订单跟踪、销售分析等功能',
          status: 'active',
          owner_id: 1,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-17T14:20:00Z'
        },
        {
          id: 2,
          name: '订单处理流程',
          description: '自动化订单处理工作流，从下单到发货的完整流程管理',
          status: 'active',
          owner_id: 1,
          created_at: '2024-01-10T09:15:00Z',
          updated_at: '2024-01-16T16:45:00Z'
        },
        {
          id: 3,
          name: '数据分析仪表盘',
          description: '实时数据可视化仪表盘，支持多维度数据分析和报表生成',
          status: 'archived',
          owner_id: 1,
          created_at: '2024-01-05T11:00:00Z',
          updated_at: '2024-01-12T13:30:00Z'
        },
        {
          id: 4,
          name: '用户权限管理',
          description: '基于角色的访问控制系统，支持细粒度权限管理',
          status: 'active',
          owner_id: 1,
          created_at: '2024-01-08T15:20:00Z',
          updated_at: '2024-01-15T10:10:00Z'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      case 'deleted': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '进行中'
      case 'archived': return '已归档'
      case 'deleted': return '已删除'
      default: return status
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">项目管理</h1>
          <p className="text-gray-600 mt-1">管理您的所有项目</p>
        </div>
        <Button onClick={() => onNavigate('create-project')} className="bg-gradient-to-r from-blue-500 to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          创建项目
        </Button>
      </div>

      {/* 搜索栏 */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索项目..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 项目网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      编辑项目
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除项目
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">
                {project.description}
              </CardDescription>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>创建于 {formatDate(project.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>所有者</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 空状态 */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? '未找到匹配的项目' : '还没有项目'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? '尝试调整搜索条件' : '创建您的第一个项目开始使用平台'}
          </p>
          {!searchTerm && (
            <Button onClick={() => onNavigate('create-project')} className="bg-gradient-to-r from-blue-500 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              创建项目
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

