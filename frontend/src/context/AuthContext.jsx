import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { mockUsers } from '../data/mockBookings.js'

/* ══════════════════════════════════════
   Roles
   ══════════════════════════════════════ */
export const ROLES = {
  USER:  'USER',
  ADMIN: 'ADMIN',
}

/* ══════════════════════════════════════
   Context
   ══════════════════════════════════════ */
const AuthContext = createContext(null)

/* ══════════════════════════════════════
   Provider
   ══════════════════════════════════════ */

/**
 * AuthProvider
 *
 * Owns the current user and exposes role-check helpers.
 *
 * Currently backed by a mock user list — swap `login()` for a real
 * POST /api/auth/login call and store the returned JWT when the
 * backend auth layer is ready.
 *
 * Default user is Alice (USER role).
 * To test admin view, call login('u5') or change DEFAULT_USER_ID below.
 */
const DEFAULT_USER_ID = 'u1'   // 'u5' for admin

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    () => mockUsers.find((u) => u.id === DEFAULT_USER_ID) ?? mockUsers[0]
  )

  // ── Role helpers ──────────────────────────────────────────

  const isAdmin = useMemo(
    () => currentUser?.role === ROLES.ADMIN,
    [currentUser]
  )

  const isUser = useMemo(
    () => currentUser?.role === ROLES.USER,
    [currentUser]
  )

  const hasRole = useCallback(
    (role) => currentUser?.role === role,
    [currentUser]
  )

  // ── Mock auth actions ─────────────────────────────────────

  /**
   * Switch the active user by id (mock login).
   * Replace with a real API call + JWT storage when auth is ready.
   */
  const login = useCallback((userId) => {
    const user = mockUsers.find((u) => u.id === userId)
    if (user) setCurrentUser(user)
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  // ── Context value ─────────────────────────────────────────
  const value = useMemo(
    () => ({
      currentUser,
      isAdmin,
      isUser,
      hasRole,
      login,
      logout,
    }),
    [currentUser, isAdmin, isUser, hasRole, login, logout]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/* ══════════════════════════════════════
   Consumer hook
   ══════════════════════════════════════ */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
