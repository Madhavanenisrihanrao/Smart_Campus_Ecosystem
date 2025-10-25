import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Filter } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { format } from 'date-fns'

export default function LostFound() {
  const { user } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState({ type: '', category: '', search: '' })
  const [formData, setFormData] = useState({
    item_type: 'lost',
    title: '',
    description: '',
    category: 'other',
    location: '',
    date_lost_found: '',
  })

  const { data: items, refetch } = useQuery({
    queryKey: ['lost-found-items', filter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filter.type) params.append('type', filter.type)
      if (filter.category) params.append('category', filter.category)
      if (filter.search) params.append('search', filter.search)
      
      const response = await api.get(`/api/lost-found/items/?${params}`)
      return response.data.results || response.data
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/lost-found/items/', formData)
      toast.success('Item reported successfully!')
      setShowForm(false)
      setFormData({
        item_type: 'lost',
        title: '',
        description: '',
        category: 'other',
        location: '',
        date_lost_found: '',
      })
      refetch()
    } catch (error) {
      toast.error('Failed to report item')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lost & Found</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Report Item
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Report Lost/Found Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  className="input"
                  value={formData.item_type}
                  onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="electronics">Electronics</option>
                  <option value="documents">Documents</option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="books">Books</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

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
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  required
                  className="input"
                  value={formData.date_lost_found}
                  onChange={(e) => setFormData({ ...formData, date_lost_found: e.target.value })}
                />
              </div>
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

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search items..."
            className="input"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
          <select
            className="input"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <select
            className="input"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="documents">Documents</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="books">Books</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item) => (
          <div key={item.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-sm ${
                item.item_type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {item.item_type === 'lost' ? 'Lost' : 'Found'}
              </span>
              <span className="text-xs text-gray-500">
                {item.category}
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>📍 {item.location}</p>
              <p>📅 {format(new Date(item.date_lost_found), 'MMM dd, yyyy')}</p>
            </div>
            {item.status === 'active' && (
              <button className="btn btn-primary w-full mt-4">Claim Item</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
