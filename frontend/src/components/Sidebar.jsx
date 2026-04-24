import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Building2, CalendarDays, Wrench,
  Bell, ShieldCheck, ChevronLeft, LogOut, BookOpen
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { mockUsers } from '../data/mockBookings.js'
import '../styles/sidebar.css'

const NAV = [
  {
    section: 'Main',
    items: [
      { to: '/',      label: 'Dashboard',  Icon: LayoutDashboard, live: true, end: true },
      { to: '/book',  label: 'Facilities', Icon: Building2,        live: true },
    ],
  },
  {
    section: 'Modules',
    items: [
      { to: '/bookings', label: 'Bookings',      sub: 'Management',         Icon: CalendarDays, live: true  },
      { to: '/tickets',  label: 'Tickets',       sub: null,                 Icon: Wrench,       live: false },
      { to: '/notifs',   label: 'Notifications', sub: null,                 Icon: Bell,         live: false },
    ],
  },
  {
    section: 'Account',
    items: [
      { to: '/settings', label: 'Settings', Icon: ShieldCheck, live: false },
    ],
  },
]

export default function Sidebar() {
  const { currentUser, isAdmin, login } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)

  if (!currentUser) return null

  const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <BookOpen size={17} color="#fff" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <div className="sidebar-logo-name">CampusBook</div>
            <div className="sidebar-logo-sub">Smart Campus Hub</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV.map(({ section, items }) => (
          <div key={section} className="sidebar-section">
            {!collapsed && <div className="sidebar-section-label">{section}</div>}
            <div className="sidebar-items">
              {items.map(({ to, label, sub, Icon, live, end }) =>
                live ? (
                  <NavLink
                    key={to} to={to} end={end}
                    className={({ isActive }) =>
                      `sidebar-item${isActive ? ' active' : ''}`
                    }
                  >
                    <span className="sidebar-item-icon"><Icon size={18} strokeWidth={1.8} /></span>
                    {!collapsed && (
                      <span className="sidebar-item-text">
                        <span className="sidebar-item-name">{label}</span>
                        {sub && <span className="sidebar-item-sub">{sub}</span>}
                      </span>
                    )}
                  </NavLink>
                ) : (
                  <div key={to} className="sidebar-item disabled">
                    <span className="sidebar-item-icon"><Icon size={18} strokeWidth={1.8} /></span>
                    {!collapsed && (
                      <span className="sidebar-item-text">
                        <span className="sidebar-item-name">{label}</span>
                        {sub && <span className="sidebar-item-sub">{sub}</span>}
                      </span>
                    )}
                    {!collapsed && <span className="sidebar-soon">Soon</span>}
                  </div>
                )
              )}

              {/* Admin panel */}
              {isAdmin && section === 'Modules' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
                >
                  <span className="sidebar-item-icon"><ShieldCheck size={18} strokeWidth={1.8} /></span>
                  {!collapsed && (
                    <span className="sidebar-item-text">
                      <span className="sidebar-item-name">Admin Panel</span>
                    </span>
                  )}
                </NavLink>
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        {/* User switcher (dev) */}
        <div style={{ position: 'relative' }}>
          <div
            className="sidebar-user"
            style={{ cursor: 'pointer' }}
            onClick={() => setSwitcherOpen(o => !o)}
          >
            <div className="sidebar-avatar">{initials}</div>
            {!collapsed && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div className="sidebar-user-name">{currentUser.name}</div>
                <span className={`sidebar-user-role ${currentUser.role.toLowerCase()}`}>
                  {currentUser.role}
                </span>
              </div>
            )}
          </div>

          {/* User switcher dropdown */}
          {switcherOpen && (
            <div style={{
              position: 'absolute', bottom: '100%', left: 0, right: 0,
              background: '#1f3a1f', border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 'var(--radius-sm)', padding: '.35rem',
              marginBottom: '.35rem', zIndex: 300,
              animation: 'slideDown .15s ease both',
            }}>
              {mockUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => { login(u.id); setSwitcherOpen(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '.55rem',
                    width: '100%', padding: '.45rem .65rem',
                    borderRadius: 'var(--radius-xs)', border: 'none',
                    background: u.id === currentUser.id ? 'rgba(5,150,105,.2)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'background var(--t-fast)',
                  }}
                  onMouseEnter={e => { if (u.id !== currentUser.id) e.currentTarget.style.background = 'rgba(255,255,255,.07)' }}
                  onMouseLeave={e => { if (u.id !== currentUser.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: 4, flexShrink: 0,
                    background: 'linear-gradient(135deg, #059669, #0d9488)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '.68rem', fontWeight: 700, color: '#fff',
                  }}>
                    {u.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '.8rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{u.name}</div>
                    <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{u.role}</div>
                  </div>
                  {u.id === currentUser.id && (
                    <span style={{ marginLeft: 'auto', color: '#6ee7b7', fontSize: '.75rem' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => navigate('/')}
          style={{ color: 'rgba(255,255,255,.35)', gap: '.5rem' }}
        >
          <LogOut size={14} strokeWidth={2} />
          {!collapsed && <span>Sign out</span>}
        </button>

        {/* Collapse toggle */}
        <button className="sidebar-collapse-btn" onClick={() => setCollapsed(o => !o)}>
          <ChevronLeft
            size={15} strokeWidth={2}
            className="sidebar-collapse-icon"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform .25s ease' }}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
