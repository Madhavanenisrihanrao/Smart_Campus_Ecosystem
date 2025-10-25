import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, token } = useAuthStore()

  // Check if user is authenticated
  if (!token || !user) {
    toast.error('Please login to access this page')
    return <Navigate to="/login" replace />
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    toast.error('You do not have permission to access this page')
    return <Navigate to="/dashboard" replace />
  }

  return children
}
