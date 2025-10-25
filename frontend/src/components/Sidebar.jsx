import { NavLink } from 'react-router-dom'
import { Home, Package, Calendar, MessageSquare, Users, Menu, X, GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const { user } = useAuthStore()

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/lost-found', icon: Package, label: 'Lost & Found' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/feedback', icon: MessageSquare, label: 'Feedback' },
    { to: '/clubs', icon: Users, label: 'Clubs' },
  ]

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-700 transition-colors"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-800 shadow-xl transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700 mt-16">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-slate-400 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <p className="text-slate-500 text-xs text-center">
            © 2025 KLH University
          </p>
        </div>
      </aside>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
