import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Server, 
  Database, 
  Activity, 
  Plus, 
  Search, 
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from 'lucide-react'

export default function MCPManagement() {
  const [providers, setProviders] = useState([])
  const [consumers, setConsumers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // 模拟数据
      setProviders([
        {
          id: 1,
          name: 'Page Context Provider',
          description: '提供页面设计和DSL上下文信息',
          endpoint: 'http://localhost:5000/api/context/pages',
          status: 'active',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'Data Model Provider',
          description: '提供数据模型和Schema上下文',
          endpoint: 'http://localhost:5000/api/context/models',
          status: 'active',
          created_at: '2024-01-14T09:20:00Z'
        },
        {
          id: 3,
          name: 'Workflow Provider',
          description: '提供业务流程和工作流上下文',
          endpoint: 'http://localhost:5000/api/context/workflows',
          status: 'inactive',
          created_at: '2024-01-13T14:15:00Z'
        }
      ])

      setConsumers([
        {
          id: 1,
          name: 'AIGC Copilot',
          description: 'AI内容生成助手',
          consumer_type: 'aigc_copilot',
          status: 'active',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'External AI Service',
          description: '外部AI服务集成',
          consumer_type: 'external_ai',
          status: 'active',
          created_at: '2024-01-14T11:45:00Z'
        }
      ])

      setEvents([
        {
          id: 1,
          event_type: 'page.updated',
          source_type: 'page',
          source_id: '1',
          tenant_id: 'project_1',
          created_at: '2024-01-17T10:30:00Z'
        },
        {
          id: 2,
          event_type: 'model.created',
          source_type: 'model',
          source_id: '3',
          tenant_id: 'project_1',
          created_at: '2024-01-17T10:25:00Z'
        },
        {
          id: 3,
          event_type: 'workflow.updated',
          source_type: 'workflow',
          source_id: '2',
          tenant_id: 'project_2',
          created_at: '2024-01-17T10:20:00Z'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch MCP data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '活跃'
      case 'inactive': return '停用'
      default: return status
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Server className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MCP 管理</h1>
          <p className="text-gray-600">Model Context Protocol 管理中心</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Context Providers</p>
                <p className="text-3xl font-bold text-gray-900">{providers.length}</p>
              </div>
              <Server className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Context Consumers</p>
                <p className="text-3xl font-bold text-gray-900">{consumers.length}</p>
              </div>
              <Database className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">今日事件</p>
                <p className="text-3xl font-bold text-gray-900">{events.length}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 标签页内容 */}
      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="providers">Context Providers</TabsTrigger>
          <TabsTrigger value="consumers">Context Consumers</TabsTrigger>
          <TabsTrigger value="events">事件监控</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Context Providers</CardTitle>
                <CardDescription>管理上下文提供者</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                添加 Provider
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Server className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{provider.name}</h4>
                          <p className="text-sm text-gray-600">{provider.description}</p>
                          <p className="text-xs text-gray-500 mt-1">端点: {provider.endpoint}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(provider.status)}
                        <Badge className={getStatusColor(provider.status)}>
                          {getStatusText(provider.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>创建时间: {formatDate(provider.created_at)}</span>
                      <Button variant="outline" size="sm">
                        配置
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumers" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Context Consumers</CardTitle>
                <CardDescription>管理上下文消费者</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                添加 Consumer
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consumers.map((consumer) => (
                  <div key={consumer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Database className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{consumer.name}</h4>
                          <p className="text-sm text-gray-600">{consumer.description}</p>
                          <p className="text-xs text-gray-500 mt-1">类型: {consumer.consumer_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(consumer.status)}
                        <Badge className={getStatusColor(consumer.status)}>
                          {getStatusText(consumer.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>创建时间: {formatDate(consumer.created_at)}</span>
                      <Button variant="outline" size="sm">
                        配置
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>事件监控</CardTitle>
              <CardDescription>实时监控 MCP 事件流</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <div>
                          <h4 className="font-medium text-gray-900">{event.event_type}</h4>
                          <p className="text-sm text-gray-600">
                            来源: {event.source_type} (ID: {event.source_id})
                          </p>
                          <p className="text-xs text-gray-500 mt-1">租户: {event.tenant_id}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(event.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {events.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无事件</h3>
                  <p className="text-gray-600">当有新的上下文事件时，它们将显示在这里</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

