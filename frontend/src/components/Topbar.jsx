import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/sidebar.css'

const TITLES = {
  '/':         'Dashboard',
  '/book':     'Resources',
  '/bookings': 'Bookings',
  '/admin':    'Admin Panel',
  '/new-booking': 'New Booking',
}

function getTitle(path) {
  if (TITLES[path]) return TITLES[path]
  const match = Object.entries(TITLES).find(([p]) => p !== '/' && path.startsWith(p))
  return match ? match[1] : 'Smart Campus'
}

export default function Topbar() {
  const { currentUser, isAdmin } = useAuth()
  const location = useLocation()
  if (!currentUser) return null

  const title = getTitle(location.pathname)
  const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-page">{title}</span>
        <span className="topbar-sep">›</span>
        <span className="topbar-sub">Smart Campus</span>
      </div>
      <div className="topbar-right">
        <span className={`topbar-role${isAdmin ? ' admin' : ''}`}>
          {currentUser.role}
        </span>
        <button className="topbar-notif" title="Notifications">
          <Bell size={15} strokeWidth={2} />
          <span className="topbar-notif-dot">3</span>
        </button>
        <div className="topbar-avatar" title={currentUser.name}>{initials}</div>
      </div>
    </header>
  )
}
