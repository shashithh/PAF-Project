import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Building2, CalendarDays, Wrench,
  Bell, ShieldCheck, LogOut, Sun, Moon, User, ChevronLeft
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { mockUsers } from '../data/mockBookings.js'
import '../styles/sidebar.css'

const NAV_MAIN = [
  { to: '/',         label: 'Dashboard',  Icon: LayoutDashboard, end: true },
  { to: '/book',     label: 'Resources',  Icon: Building2 },
  { to: '/bookings', label: 'Bookings',   Icon: CalendarDays },
  { to: '/tickets',  label: 'Tickets',    Icon: Wrench,       soon: true },
  { to: '/notifs',   label: 'Notifications', Icon: Bell,      soon: true },
]

const NAV_ADMIN = [
  { to: '/admin', label: 'Admin Panel', Icon: ShieldCheck },
]

export default function Sidebar() {
  const { currentUser, isAdmin, login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)

  if (!currentUser) return null

  const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏫</div>
        {!collapsed && (
          <>
            <div>
              <div className="sidebar-logo-name">Smart Campus</div>
              <div className="sidebar-logo-sub">Operations Hub</div>
            </div>
            <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>

        {NAV_MAIN.map(({ to, label, Icon, end, soon }) =>
          soon ? (
            <div key={to} className="sidebar-item disabled">
              <Icon size={17} />
              {!collapsed && <><span style={{ flex: 1 }}>{label}</span><span className="sidebar-soon">Soon</span></>}
            </div>
          ) : (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
            >
              <Icon size={17} />
              {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
            </NavLink>
          )
        )}

        {isAdmin && (
          <>
            <div className="sidebar-section-label mt">Admin Panel</div>
            {NAV_ADMIN.map(({ to, label, Icon }) => (
              <NavLink
                key={to} to={to}
                className={({ isActive }) => `sidebar-item${isActive ? ' active-admin' : ''}`}
              >
                <Icon size={17} />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        {/* User switcher */}
        <div style={{ position: 'relative' }}>
          <div
            className="sidebar-user"
            style={{ cursor: 'pointer' }}
            onClick={() => setSwitcherOpen(o => !o)}
          >
            <div className="sidebar-avatar">{initials}</div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sidebar-user-name">{currentUser.name}</div>
                <div className="sidebar-user-role">{currentUser.role}</div>
              </div>
            )}
          </div>

          {switcherOpen && (
            <div style={{
              position: 'absolute', bottom: '100%', left: 0, right: 0,
              background: 'var(--card)', border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius)', padding: '6px',
              marginBottom: '6px', zIndex: 300,
              animation: 'slideDown .15s ease both',
              boxShadow: 'var(--shadow)',
            }}>
              {mockUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => { login(u.id); setSwitcherOpen(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '8px 10px',
                    borderRadius: 6, border: 'none',
                    background: u.id === currentUser.id ? 'var(--primary-glow)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (u.id !== currentUser.id) e.currentTarget.style.background = 'var(--bg-3)' }}
                  onMouseLeave={e => { if (u.id !== currentUser.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 700, color: '#fff',
                  }}>{u.name[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>{u.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', textTransform: 'uppercase' }}>{u.role}</div>
                  </div>
                  {u.id === currentUser.id && <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}
          onClick={() => navigate('/')}
        >
          <LogOut size={15} />
          {!collapsed && 'Logout'}
        </button>

        {/* Collapse */}
        <button
          onClick={() => setCollapsed(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            width: '100%', padding: '6px', borderRadius: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 600,
            transition: 'all 0.15s', marginTop: 4,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-3)' }}
        >
          <ChevronLeft size={14} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </aside>
  )
}
