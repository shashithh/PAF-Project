import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/navbar.css'

function Navbar({ currentUser }) {
  return (
    <header className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <span className="brand-icon">🏛️</span>
        <span className="brand-name">Smart Campus</span>
      </div>

      {/* Navigation links */}
      <nav className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          My Bookings
        </NavLink>

        {currentUser.role === 'ADMIN' && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
          >
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* User info */}
      <div className="navbar-user">
        <span className="user-avatar">{currentUser.name[0]}</span>
        <span className="user-name">{currentUser.name}</span>
        <span className={`role-badge role-${currentUser.role.toLowerCase()}`}>
          {currentUser.role}
        </span>
      </div>
    </header>
  )
}

export default Navbar
