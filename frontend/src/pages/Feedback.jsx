import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, MessageSquare } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { format } from 'date-fns'

export default function Feedback() {
  const { user } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    is_anonymous: false,
  })

  const { data: feedbacks, refetch } = useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      const response = await api.get('/api/feedback/')
      return response.data.results || response.data
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/feedback/', formData)
      toast.success('Feedback submitted successfully!')
      setShowForm(false)
      setFormData({
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        is_anonymous: false,
      })
      refetch()
    } catch (error) {
      toast.error('Failed to submit feedback')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || colors.pending
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feedback & Grievances</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Submit Feedback
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Submit New Feedback</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                required
                className="input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                required
                className="input"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="academic">Academic</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="faculty">Faculty</option>
                  <option value="administration">Administration</option>
                  <option value="hostel">Hostel</option>
                  <option value="library">Library</option>
                  <option value="cafeteria">Cafeteria</option>
                  <option value="transport">Transport</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  className="input"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.is_anonymous}
                onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="anonymous" className="text-sm">Submit anonymously</label>
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbacks?.map((feedback) => (
          <div key={feedback.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{feedback.title}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(feedback.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(feedback.status)}`}>
                {feedback.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">{feedback.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                {feedback.category}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                Priority: {feedback.priority}
              </span>
            </div>
            {feedback.responses?.length > 0 && (
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <h4 className="font-medium mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Responses ({feedback.responses.length})
                </h4>
                {feedback.responses.map((response) => (
                  <div key={response.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-2">
                    <p className="text-sm">{response.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(response.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
