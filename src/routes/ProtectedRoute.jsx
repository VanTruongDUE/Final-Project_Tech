import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { resolveRoleHome } from '../utils/roles'

export default function ProtectedRoute({ allowedRoles }) {
  const { currentUser, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles?.length && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={resolveRoleHome(currentUser.role)} replace />
  }

  return <Outlet />
}
