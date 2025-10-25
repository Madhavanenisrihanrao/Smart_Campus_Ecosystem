import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Calendar as CalendarIcon, MapPin, Users, X } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { format } from 'date-fns'

export default function Events() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState({ category: '', status: 'upcoming' })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic',
    status: 'upcoming',
    start_date: '',
    end_date: '',
    venue: '',
    max_participants: '',
  })

  const { data: events, refetch } = useQuery({
    queryKey: ['events', filter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filter.category) params.append('category', filter.category)
      if (filter.status) params.append('status', filter.status)
      
      const response = await api.get(`/api/events/?${params}`)
      return response.data.results || response.data
    },
  })

  const createEventMutation = useMutation({
    mutationFn: async (newEvent) => {
      const response = await api.post('/api/events/', newEvent)
      return response.data
    },
    onSuccess: () => {
      toast.success('Event created successfully!')
      setShowForm(false)
      setFormData({
        title: '',
        description: '',
        category: 'academic',
        status: 'upcoming',
        start_date: '',
        end_date: '',
        venue: '',
        max_participants: '',
      })
      refetch()
      queryClient.invalidateQueries(['events'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create event')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createEventMutation.mutate(formData)
  }

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/api/events/${eventId}/register/`)
      toast.success('Successfully registered for event!')
      refetch()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
        {(user?.role === 'faculty' || user?.role === 'admin') && (
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Event
          </button>
        )}
      </div>

      {/* Add Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Create New Event</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your event"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="academic">Academic</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                    <option value="technical">Technical</option>
                    <option value="social">Social</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="Event location"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                  placeholder="Optional"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createEventMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="input"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="academic">Academic</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="technical">Technical</option>
            <option value="social">Social</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
          </select>
          <select
            className="input"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <div key={event.id} className="card">
            <div className="mb-3">
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                {event.category}
              </span>
            </div>
            <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {event.description}
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {format(new Date(event.start_date), 'MMM dd, yyyy - HH:mm')}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {event.venue}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {event.participant_count || 0} registered
              </div>
            </div>
            {!event.is_registered && event.status === 'upcoming' && (
              <button
                onClick={() => handleRegister(event.id)}
                className="btn btn-primary w-full"
              >
                Register
              </button>
            )}
            {event.is_registered && (
              <div className="bg-green-100 text-green-800 text-center py-2 rounded-lg">
                ✓ Registered
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
