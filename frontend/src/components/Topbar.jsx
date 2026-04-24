import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/sidebar.css'

const PAGE_TITLES = {
  '/':                          'Dashboard',
  '/book':                      'Facilities',
  '/bookings':                  'My Bookings',
  '/admin':                     'Admin Panel',
  '/new-booking':               'New Booking',
}

function getTitle(pathname) {
  // exact match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  // prefix match
  const match = Object.entries(PAGE_TITLES).find(([p]) => p !== '/' && pathname.startsWith(p))
  return match ? match[1] : 'CampusBook'
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
        {/* Role pill */}
        <span className={`topbar-role-pill ${currentUser.role.toLowerCase()}`}>
          {currentUser.role}
        </span>

        {/* Notifications */}
        <button className="topbar-notif" title="Notifications">
          <Bell size={15} strokeWidth={2} />
          <span className="topbar-notif-dot">3</span>
        </button>

        {/* Avatar */}
        <div className="topbar-user-avatar" title={currentUser.name}>
          {initials}
        </div>
      </div>
    </header>
  )
}
