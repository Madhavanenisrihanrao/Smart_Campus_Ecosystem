import { Link } from 'react-router-dom'
import { Bell, User, LogOut, Shield, GraduationCap, UserCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { useState, useEffect } from 'react'
import api from '../lib/api'
import NotificationPanel from './NotificationPanel'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { unreadCount, setUnreadCount } = useNotificationStore()
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/api/notifications/unread_count/')
        setUnreadCount(response.data.count)
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }

    if (user) {
      fetchUnreadCount()
      // Refresh count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [setUnreadCount, user])

  const handleLogout = () => {
    logout()
  }

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-purple-600" />
      case 'faculty':
        return <GraduationCap className="w-4 h-4 text-blue-600" />
      default:
        return <UserCircle className="w-4 h-4 text-green-600" />
    }
  }

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'faculty':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-40 border-b border-gray-200">
        <div className="mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Left - Role Badge */}
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${getRoleBadgeColor()} text-xs font-semibold`}>
                {getRoleIcon()}
                <span className="capitalize">{user?.role || 'Guest'}</span>
              </div>
            </div>
            
            {/* Center - Logo and KLH Campus Hub */}
            <Link to="/dashboard" className="flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2 hover:scale-105 transition-transform">
              <img src="/kl-logo.png" alt="KL University" className="h-12 w-auto" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                KLH Campus Hub
              </span>
            </Link>

            <div className="flex items-center space-x-3">
              {/* Notifications Button */}
              <button
                className="relative p-2 rounded-full hover:bg-blue-50 transition-all duration-200 group"
                onClick={() => setShowNotifications(true)}
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Link */}
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                title="Profile"
              >
                <User className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="hidden md:block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  {user?.first_name || user?.email?.split('@')[0]}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:block text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  )
}
