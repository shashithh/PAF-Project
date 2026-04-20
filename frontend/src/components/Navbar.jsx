import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { mockUsers } from '../data/mockBookings.js'
import '../styles/navbar.css'

export default function Navbar() {
  const { currentUser, isAdmin, login } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (!currentUser) return null

  return (
    <header className="navbar">
      {/* Brand */}
      <button className="nav-brand" onClick={() => navigate('/')}>
        <span className="nav-logo">🏛</span>
        <span>CampusBook</span>
      </button>

      {/* Nav links */}
      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/book" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Resources
        </NavLink>
        <NavLink to="/new-booking" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          New booking
        </NavLink>
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          My bookings
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link nav-link-admin${isActive ? ' active' : ''}`}>
            Admin
          </NavLink>
        )}
      </nav>

      {/* User switcher */}
      <div className="nav-user">
        <button
          className="nav-user-btn"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="nav-avatar">{currentUser.name[0]}</span>
          <span className="nav-uname">{currentUser.name}</span>
          <span className={`nav-role nav-role-${currentUser.role.toLowerCase()}`}>
            {currentUser.role}
          </span>
          <span className="nav-chevron">▾</span>
        </button>

        {open && (
          <ul className="nav-dropdown" role="listbox">
            {mockUsers.map(u => (
              <li key={u.id} role="option" aria-selected={u.id === currentUser.id}>
                <button
                  className={`nav-dd-item${u.id === currentUser.id ? ' active' : ''}`}
                  onClick={() => { login(u.id); setOpen(false) }}
                >
                  <span className="nav-dd-avatar">{u.name[0]}</span>
                  <span>
                    <span className="nav-dd-name">{u.name}</span>
                    <span className="nav-dd-role">{u.role}</span>
                  </span>
                  {u.id === currentUser.id && <span className="nav-dd-check">✓</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  )
}
