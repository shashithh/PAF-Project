import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext.jsx'
import { mockUsers } from '../data/mockBookings.js'
import '../styles/navbar.css'

function Navbar() {
  const { currentUser, isAdmin, login } = useAuth()
  const [showSwitcher, setShowSwitcher] = useState(false)

  if (!currentUser) return null

  return (
    <header className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <span className="brand-icon" aria-hidden="true">🏛️</span>
        <span className="brand-name">Smart Campus</span>
      </div>

      {/* Navigation links */}
      <nav className="navbar-links" aria-label="Main navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          My Bookings
        </NavLink>

        {/* Admin-only link — hidden from USER role */}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-btn nav-btn-admin ${isActive ? 'active' : ''}`}
          >
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* User section */}
      <div className="navbar-user">
        {/* Dev user switcher — remove in production */}
        <div className="user-switcher-wrap">
          <button
            className="user-switcher-trigger"
            onClick={() => setShowSwitcher((v) => !v)}
            aria-expanded={showSwitcher}
            aria-haspopup="listbox"
            aria-label="Switch user (dev only)"
            title="Dev: switch user"
          >
            <span className="user-avatar" aria-hidden="true">
              {currentUser.name[0]}
            </span>
            <span className="user-name">{currentUser.name}</span>
            <span
              className={`role-badge role-${currentUser.role.toLowerCase()}`}
              aria-label={`Role: ${currentUser.role}`}
            >
              {currentUser.role}
            </span>
            <span className="switcher-chevron" aria-hidden="true">▾</span>
          </button>

          {showSwitcher && (
            <ul
              className="user-switcher-menu"
              role="listbox"
              aria-label="Select user"
            >
              {mockUsers.map((u) => (
                <li key={u.id} role="option" aria-selected={u.id === currentUser.id}>
                  <button
                    className={`switcher-item ${u.id === currentUser.id ? 'switcher-item-active' : ''}`}
                    onClick={() => { login(u.id); setShowSwitcher(false) }}
                  >
                    <span className="switcher-avatar" aria-hidden="true">{u.name[0]}</span>
                    <span className="switcher-info">
                      <span className="switcher-name">{u.name}</span>
                      <span className={`switcher-role role-${u.role.toLowerCase()}`}>
                        {u.role}
                      </span>
                    </span>
                    {u.id === currentUser.id && (
                      <span className="switcher-check" aria-hidden="true">✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
