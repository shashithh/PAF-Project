import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * ProtectedRoute
 *
 * Wraps a route element and enforces role-based access.
 *
 * Props:
 *   requiredRole  — if provided, the user must have this exact role.
 *                   Omit to require only that the user is logged in.
 *   redirectTo    — where to send unauthorised users (default: '/unauthorized')
 *   children      — the page element to render when access is granted
 *
 * Usage:
 *   <ProtectedRoute requiredRole="ADMIN">
 *     <AdminPage />
 *   </ProtectedRoute>
 */
function ProtectedRoute({ requiredRole, redirectTo = '/unauthorized', children }) {
  const { currentUser, hasRole } = useAuth()
  const location = useLocation()

  // Not logged in at all
  if (!currentUser) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />
  }

  // Logged in but wrong role
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
