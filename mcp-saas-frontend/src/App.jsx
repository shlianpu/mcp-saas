import { useState } from 'react'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import ProjectList from './components/ProjectList.jsx'
import AIGCCopilot from './components/AIGCCopilot.jsx'
import MCPManagement from './components/MCPManagement.jsx'
import './App.css'

function App() {
  const [activeItem, setActiveItem] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleNavigate = (itemId) => {
    setActiveItem(itemId)
    setSidebarOpen(false) // 在移动端关闭侧边栏
  }

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />
      case 'project-list':
      case 'projects':
        return <ProjectList onNavigate={handleNavigate} />
      case 'aigc':
      case 'aigc-requests':
        return <AIGCCopilot />
      case 'mcp':
      case 'providers':
      case 'consumers':
      case 'events':
        return <MCPManagement />
      case 'create-project':
        return (
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">创建新项目</h1>
              <div className="bg-white rounded-lg border p-6">
                <p className="text-gray-600 mb-4">项目创建功能正在开发中...</p>
                <button 
                  onClick={() => handleNavigate('project-list')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  返回项目列表
                </button>
              </div>
            </div>
          </div>
        )
      case 'page-designer':
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">页面设计器</h1>
              <div className="bg-white rounded-lg border p-6">
                <p className="text-gray-600 mb-4">可视化页面设计器正在开发中...</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">组件库</h3>
                    <p className="text-gray-600">拖拽组件到画布</p>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">设计画布</h3>
                    <p className="text-gray-600">在这里设计您的页面</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'data-models':
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">数据模型管理</h1>
              <div className="bg-white rounded-lg border p-6">
                <p className="text-gray-600 mb-4">数据模型设计器正在开发中...</p>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">用户模型</h3>
                    <p className="text-sm text-gray-600">包含用户基本信息字段</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">项目模型</h3>
                    <p className="text-sm text-gray-600">项目相关数据结构</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'workflows':
        return (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">工作流管理</h1>
              <div className="bg-white rounded-lg border p-6">
                <p className="text-gray-600 mb-4">BPMN 工作流设计器正在开发中...</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">流程设计器</h3>
                  <p className="text-gray-600">可视化设计业务流程</p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="p-6">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">功能开发中</h1>
              <p className="text-gray-600 mb-6">该功能正在开发中，敬请期待...</p>
              <button 
                onClick={() => handleNavigate('dashboard')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                返回仪表盘
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onMenuClick={handleMenuClick} />
      <div className="flex">
        <Sidebar 
          activeItem={activeItem} 
          onItemClick={handleNavigate}
          isOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App
