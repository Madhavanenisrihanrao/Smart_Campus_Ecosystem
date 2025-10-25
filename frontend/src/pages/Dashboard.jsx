import { useAuthStore } from '../store/authStore'
import { Package, Calendar, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { format } from 'date-fns'

export default function Dashboard() {
  const { user } = useAuthStore()

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const [lostFound, upcomingEvents, ongoingEvents, completedEvents, notifications] = await Promise.all([
          api.get('/api/lost-found/items/'),
          api.get('/api/events/?status=upcoming'),
          api.get('/api/events/?status=ongoing'),
          api.get('/api/events/?status=completed'),
          api.get('/api/notifications/?limit=5'),
        ])
        return {
          lostFoundItems: lostFound.data,
          upcomingEvents: upcomingEvents.data,
          ongoingEvents: ongoingEvents.data,
          completedEvents: completedEvents.data,
          notifications: notifications.data,
        }
      } catch (error) {
        console.error('Dashboard error:', error)
        return {
          lostFoundItems: [],
          upcomingEvents: [],
          ongoingEvents: [],
          completedEvents: [],
          notifications: [],
        }
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">Error loading dashboard. Please refresh the page.</div>
      </div>
    )
  }

  // Safely handle data - ensure arrays
  const upcomingEvents = Array.isArray(stats?.upcomingEvents) ? stats.upcomingEvents.slice(0, 3) : []
  const ongoingEvents = Array.isArray(stats?.ongoingEvents) ? stats.ongoingEvents.slice(0, 3) : []
  const completedEvents = Array.isArray(stats?.completedEvents) ? stats.completedEvents.slice(0, 3) : []
  const recentLostFound = Array.isArray(stats?.lostFoundItems) ? stats.lostFoundItems.slice(0, 4) : []
  const announcements = Array.isArray(stats?.notifications) ? stats.notifications : []

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-blue-100 mt-1 capitalize">{user?.role}</p>
        <div className="flex gap-3 mt-4">
          <Link to="/lost-found" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Lost an Item?
          </Link>
          <Link to="/feedback" className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Submit Feedback
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Events and Lost & Found */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
              <Link to="/events" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </Link>
            </div>
            
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-100 rounded-lg p-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {format(new Date(event.start_date), 'MMM dd, yyyy')} • {event.location}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {event.category}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Ongoing Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Ongoing Events</h2>
              <Link to="/events" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </Link>
            </div>
            
            <div className="space-y-3">
              {ongoingEvents.length > 0 ? (
                ongoingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className="flex-shrink-0">
                      <div className="bg-green-100 rounded-lg p-3">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {format(new Date(event.start_date), 'MMM dd, yyyy')} • {event.venue}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Live
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No ongoing events</p>
              )}
            </div>
          </div>

          {/* Completed Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Completed Events</h2>
              <Link to="/events" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </Link>
            </div>
            
            <div className="space-y-3">
              {completedEvents.length > 0 ? (
                completedEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className="flex-shrink-0">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <Calendar className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {format(new Date(event.start_date), 'MMM dd, yyyy')} • {event.venue}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Ended
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No completed events</p>
              )}
            </div>
          </div>

          {/* Lost & Found Highlights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Lost & Found Highlights</h2>
              <Link to="/lost-found" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {recentLostFound.length > 0 ? (
                recentLostFound.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`${item.type === 'lost' ? 'bg-orange-100' : 'bg-teal-100'} rounded-lg p-2`}>
                        <Package className={`h-5 w-5 ${item.type === 'lost' ? 'text-orange-600' : 'text-teal-600'}`} />
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${item.type === 'lost' ? 'bg-orange-100 text-orange-700' : 'bg-teal-100 text-teal-700'}`}>
                        {item.type === 'lost' ? 'Lost' : 'Found'}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-gray-500 text-sm text-center py-8">No items reported</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Announcements */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Real-time Announcements</h2>
            </div>
            
            <div className="space-y-3">
              {announcements && announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r-lg">
                    <p className="font-medium text-gray-900 text-sm">{announcement.message}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {format(new Date(announcement.created_at), 'MMM dd, h:mm a')}
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No announcements yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
