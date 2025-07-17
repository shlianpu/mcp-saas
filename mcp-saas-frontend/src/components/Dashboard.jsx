import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  FolderOpen, 
  Database, 
  Workflow, 
  Bot, 
  TrendingUp, 
  Users,
  Activity,
  Plus,
  ArrowRight
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const statsData = [
  { name: '项目数量', value: 12, icon: FolderOpen, color: 'bg-blue-500' },
  { name: '数据模型', value: 45, icon: Database, color: 'bg-green-500' },
  { name: '工作流', value: 23, icon: Workflow, color: 'bg-purple-500' },
  { name: 'AIGC 请求', value: 156, icon: Bot, color: 'bg-orange-500' }
]

const chartData = [
  { name: '周一', projects: 4, requests: 24 },
  { name: '周二', projects: 3, requests: 13 },
  { name: '周三', projects: 2, requests: 18 },
  { name: '周四', projects: 5, requests: 39 },
  { name: '周五', projects: 4, requests: 28 },
  { name: '周六', projects: 1, requests: 15 },
  { name: '周日', projects: 2, requests: 22 }
]

const recentProjects = [
  { id: 1, name: '客户管理系统', status: 'active', lastModified: '2小时前' },
  { id: 2, name: '订单处理流程', status: 'development', lastModified: '1天前' },
  { id: 3, name: '数据分析仪表盘', status: 'completed', lastModified: '3天前' },
  { id: 4, name: '用户权限管理', status: 'active', lastModified: '5天前' }
]

const recentAIGCRequests = [
  { id: 1, type: '页面生成', prompt: '创建用户注册表单', status: 'completed', time: '10分钟前' },
  { id: 2, type: 'API生成', prompt: '用户CRUD接口', status: 'processing', time: '25分钟前' },
  { id: 3, type: '流程设计', prompt: '订单审批流程', status: 'completed', time: '1小时前' },
  { id: 4, type: '数据模型', prompt: '产品信息模型', status: 'completed', time: '2小时前' }
]

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'development': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-gray-100 text-gray-800'
    case 'processing': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'active': return '进行中'
    case 'development': return '开发中'
    case 'completed': return '已完成'
    case 'processing': return '处理中'
    default: return status
  }
}

export default function Dashboard({ onNavigate }) {
  return (
    <div className="p-6 space-y-6">
      {/* 欢迎区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">欢迎回来！</h1>
          <p className="text-gray-600 mt-1">这里是您的 MCP-SaaS 平台概览</p>
        </div>
        <Button onClick={() => onNavigate('create-project')} className="bg-gradient-to-r from-blue-500 to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          创建新项目
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              项目活动趋势
            </CardTitle>
            <CardDescription>过去一周的项目创建和AIGC请求统计</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="projects" fill="#3b82f6" name="新建项目" />
                <Bar dataKey="requests" fill="#8b5cf6" name="AIGC请求" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              系统活跃度
            </CardTitle>
            <CardDescription>实时系统使用情况</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 最近项目和AIGC请求 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>最近项目</CardTitle>
              <CardDescription>您最近修改的项目</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('project-list')}>
              查看全部 <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500">{project.lastModified}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>最近 AIGC 请求</CardTitle>
              <CardDescription>AI 生成内容的最新请求</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('aigc-requests')}>
              查看全部 <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAIGCRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{request.type}</p>
                      <p className="text-sm text-gray-500">{request.prompt}</p>
                      <p className="text-xs text-gray-400">{request.time}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusText(request.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

