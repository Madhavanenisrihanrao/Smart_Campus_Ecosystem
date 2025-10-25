import { useAuthStore } from '../store/authStore'

/**
 * Component to conditionally render content based on user role
 * @param {string[]} allowedRoles - Array of roles that can see the content
 * @param {ReactNode} children - Content to render if user has permission
 * @param {ReactNode} fallback - Content to render if user doesn't have permission (optional)
 */
export default function RoleBasedAccess({ allowedRoles = [], children, fallback = null }) {
  const { user } = useAuthStore()

  if (!user) {
    return fallback
  }

  // If no specific roles are required, show to all authenticated users
  if (allowedRoles.length === 0) {
    return children
  }

  // Check if user has required role
  if (allowedRoles.includes(user.role)) {
    return children
  }

  return fallback
}
