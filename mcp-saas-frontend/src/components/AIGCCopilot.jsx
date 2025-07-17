import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  Bot, 
  Send, 
  Loader2, 
  Sparkles, 
  Code, 
  Database, 
  Workflow,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'

const requestTypes = [
  { value: 'generate_page', label: '生成页面', icon: FileText, description: '根据描述生成页面布局和组件' },
  { value: 'generate_api', label: '生成API', icon: Code, description: '生成RESTful API接口代码' },
  { value: 'generate_model', label: '生成数据模型', icon: Database, description: '创建数据库模型和Schema' },
  { value: 'generate_workflow', label: '生成工作流', icon: Workflow, description: '设计业务流程和工作流' }
]

export default function AIGCCopilot() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [requestType, setRequestType] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/mcp/aigc/requests?limit=10')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Failed to fetch AIGC requests:', error)
      // 使用模拟数据
      setRequests([
        {
          id: 1,
          request_type: 'generate_page',
          input_prompt: '创建一个用户注册表单，包含姓名、邮箱、密码和确认密码字段',
          status: 'completed',
          created_at: '2024-01-17T10:30:00Z',
          completed_at: '2024-01-17T10:31:00Z',
          model_used: 'gpt-4',
          output_result: {
            type: 'page',
            components: [
              { type: 'header', props: { title: '用户注册' } },
              { type: 'form', props: { fields: [
                { name: 'name', type: 'text', label: '姓名' },
                { name: 'email', type: 'email', label: '邮箱' },
                { name: 'password', type: 'password', label: '密码' },
                { name: 'confirmPassword', type: 'password', label: '确认密码' }
              ]}}
            ]
          }
        },
        {
          id: 2,
          request_type: 'generate_api',
          input_prompt: '为用户管理创建CRUD API接口',
          status: 'processing',
          created_at: '2024-01-17T10:25:00Z',
          model_used: 'gpt-4'
        },
        {
          id: 3,
          request_type: 'generate_model',
          input_prompt: '设计产品信息数据模型，包含名称、价格、描述、分类等字段',
          status: 'completed',
          created_at: '2024-01-17T09:45:00Z',
          completed_at: '2024-01-17T09:46:00Z',
          model_used: 'gpt-4'
        }
      ])
    }
  }

  const handleSubmit = async () => {
    if (!prompt.trim() || !requestType) return

    setLoading(true)
    try {
      const response = await fetch('/api/mcp/aigc/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // 模拟用户ID
          request_type: requestType,
          input_prompt: prompt,
          model_used: 'gpt-4'
        })
      })

      if (response.ok) {
        const newRequest = await response.json()
        setRequests(prev => [newRequest, ...prev])
        setPrompt('')
        setRequestType('')
      }
    } catch (error) {
      console.error('Failed to create AIGC request:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'processing': return '处理中'
      case 'failed': return '失败'
      case 'pending': return '等待中'
      default: return status
    }
  }

  const getRequestTypeInfo = (type) => {
    return requestTypes.find(t => t.value === type) || { label: type, icon: Bot }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  return (
    <div className="p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AIGC Copilot</h1>
          <p className="text-gray-600">AI 驱动的内容生成助手</p>
        </div>
      </div>

      {/* 新建请求 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            创建新的生成请求
          </CardTitle>
          <CardDescription>
            描述您想要生成的内容，AI 将为您创建相应的代码、模型或流程
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">生成类型</label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger>
                <SelectValue placeholder="选择要生成的内容类型" />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">描述需求</label>
            <Textarea
              placeholder="详细描述您想要生成的内容，包括功能要求、样式偏好等..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={!prompt.trim() || !requestType || loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                开始生成
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 请求历史 */}
      <Card>
        <CardHeader>
          <CardTitle>生成历史</CardTitle>
          <CardDescription>您最近的 AI 生成请求</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => {
              const typeInfo = getRequestTypeInfo(request.request_type)
              const Icon = typeInfo.icon
              
              return (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{typeInfo.label}</h4>
                        <p className="text-sm text-gray-600">{request.input_prompt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusText(request.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>模型: {request.model_used}</span>
                      <span>创建: {formatDate(request.created_at)}</span>
                      {request.completed_at && (
                        <span>完成: {formatDate(request.completed_at)}</span>
                      )}
                    </div>
                    {request.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        查看结果
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {requests.length === 0 && (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">还没有生成请求</h3>
              <p className="text-gray-600">创建您的第一个 AI 生成请求开始体验</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

