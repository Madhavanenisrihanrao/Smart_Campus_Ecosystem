import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, Calendar, MapPin } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function Clubs() {
  const [filter, setFilter] = useState({ category: '' })

  const { data: clubs, refetch } = useQuery({
    queryKey: ['clubs', filter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filter.category) params.append('category', filter.category)
      
      const response = await api.get(`/api/clubs/?${params}`)
      return response.data.results || response.data
    },
  })

  const handleJoin = async (clubId) => {
    try {
      await api.post(`/api/clubs/${clubId}/join/`)
      toast.success('Successfully joined the club!')
      refetch()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to join club')
    }
  }

  const handleLeave = async (clubId) => {
    try {
      await api.post(`/api/clubs/${clubId}/leave/`)
      toast.success('Successfully left the club')
      refetch()
    } catch (error) {
      toast.error('Failed to leave club')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Clubs</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Join clubs and participate in campus activities
        </p>
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <select
          className="input"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="technical">Technical</option>
          <option value="cultural">Cultural</option>
          <option value="sports">Sports</option>
          <option value="social">Social Service</option>
          <option value="academic">Academic</option>
          <option value="entrepreneurship">Entrepreneurship</option>
        </select>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs?.map((club) => (
          <div key={club.id} className="card">
            <div className="mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                {club.category}
              </span>
            </div>
            <h3 className="font-bold text-xl mb-2">{club.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {club.description}
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {club.member_count} members
              </div>
              {club.president_details && (
                <div className="text-xs">
                  President: {club.president_details.first_name} {club.president_details.last_name}
                </div>
              )}
            </div>

            {/* Recent Activities */}
            {club.recent_activities?.length > 0 && (
              <div className="mb-4 pt-4 border-t dark:border-gray-700">
                <h4 className="text-sm font-medium mb-2">Recent Activities</h4>
                <div className="space-y-2">
                  {club.recent_activities.slice(0, 2).map((activity) => (
                    <div key={activity.id} className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-gray-500">{activity.activity_type}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!club.is_member ? (
              <button
                onClick={() => handleJoin(club.id)}
                className="btn btn-primary w-full"
              >
                Join Club
              </button>
            ) : (
              <div className="space-y-2">
                <div className="bg-green-100 text-green-800 text-center py-2 rounded-lg text-sm">
                  ✓ Member
                </div>
                <button
                  onClick={() => handleLeave(club.id)}
                  className="btn btn-secondary w-full text-sm"
                >
                  Leave Club
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
