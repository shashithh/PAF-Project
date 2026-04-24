import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { mockUsers } from '../data/mockBookings.js'
import {
  BookOpen, LayoutDashboard, CalendarPlus, ShieldCheck,
  ChevronDown, Check, LogOut
} from 'lucide-react'
import '../styles/navbar.css'

export default function Navbar() {
  const { currentUser, isAdmin, login } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (!e.target.closest('.nav-user')) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!currentUser) return null

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      {/* Brand */}
      <button className="nav-brand" onClick={() => navigate('/')}>
        <span className="nav-logo">
          <BookOpen size={16} strokeWidth={2.5} />
        </span>
        CampusBook
      </button>

      {/* Nav links */}
      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/book" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <LayoutDashboard size={14} />
          Resources
        </NavLink>
        <NavLink to="/new-booking" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <CalendarPlus size={14} />
          New booking
        </NavLink>
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <BookOpen size={14} />
          My bookings
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link nav-link-admin${isActive ? ' active' : ''}`}>
            <ShieldCheck size={14} />
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
          <span className="nav-chevron">
            <ChevronDown size={13} strokeWidth={2.5} />
          </span>
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
                  {u.id === currentUser.id && (
                    <span className="nav-dd-check">
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  )
}
