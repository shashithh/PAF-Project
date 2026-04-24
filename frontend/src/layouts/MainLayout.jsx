import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
      </svg>
    ),
  },
  {
    to: '/resources',
    label: 'Resources',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    to: '/user-management',
    label: 'User Management',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    adminOnly: true,
  },
  {
    to: '/notifications',
    label: 'Notifications',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    adminOnly: true,
  },
]

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/resources': 'Resources Catalogue',
  '/resources/new': 'Add Resource',
  '/user-management': 'User Management',
  '/notifications': 'Notifications',
}

export default function MainLayout() {
  const { auth, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const currentTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || 'Campusora'

  const initials = auth?.username?.slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="flex h-screen overflow-hidden bg-surface">

      {/* ── Sidebar ─────────────────────────────────── */}
      <aside
        className={`
          flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out
          bg-surface-card border-r border-surface-border
          ${sidebarOpen ? 'w-64' : 'w-18'}
        `}
        style={{ minWidth: sidebarOpen ? '256px' : '72px' }}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-5 h-[72px] border-b border-surface-border flex-shrink-0">
          {/* Logo mark */}
          <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary-500 to-teal-600 flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-base font-bold text-ink tracking-tight">Campusora</p>
              <p className="text-xs text-ink-muted">Smart Campus Hub</p>
            </div>
          )}
        </div>

        {/* Nav section label */}
        {sidebarOpen && (
          <div className="px-5 pt-5 pb-2">
            <p className="section-title">Navigation</p>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.filter(item => !item.adminOnly || isAdmin).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
                ${isActive
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-ink-secondary hover:bg-surface-hover hover:text-ink'
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-semibold truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom user area */}
        <div className="px-3 py-4 border-t border-surface-border space-y-1 flex-shrink-0">
          {sidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-muted mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink truncate">{auth?.username}</p>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold
                  ${isAdmin
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-teal-100 text-teal-700'
                  }`}>
                  {auth?.role}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl
                       text-ink-muted hover:text-ink hover:bg-surface-hover transition-all text-xs font-semibold"
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content area ───────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top Navbar */}
        <header className="flex items-center justify-between px-7 h-[72px] bg-surface-card border-b border-surface-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-ink">{currentTitle}</h1>
            <span className="text-ink-muted text-sm hidden sm:inline">
              — Facilities &amp; Assets
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Breadcrumb hint */}
            <div className="hidden md:flex items-center gap-2 text-xs text-ink-muted bg-surface-muted px-3 py-1.5 rounded-lg">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Module A
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-ink-secondary
                         hover:text-rose-600 transition-colors px-3 py-2 rounded-xl hover:bg-rose-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-7 bg-surface">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
