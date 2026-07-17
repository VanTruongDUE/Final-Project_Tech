import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { resolveRoleHome } from '../utils/roles'

export default function ProtectedRoute({ allowedRoles }) {
  const { currentUser, isAuthenticated, isAuthLoading } = useAuth()
  const location = useLocation()

  if (isAuthLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const currentRoles = currentUser.roles?.length ? currentUser.roles : [currentUser.role]

  if (allowedRoles?.length && !currentRoles.some((role) => allowedRoles.includes(role))) {
    return <Navigate to={resolveRoleHome(currentRoles)} replace />
  }

  return <Outlet />
}
