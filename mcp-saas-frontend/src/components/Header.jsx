import { Button } from '@/components/ui/button.jsx'
import { Menu, User, Settings, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx'

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">MCP-SaaS Platform</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            设置
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span>用户</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                个人资料
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                账户设置
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

