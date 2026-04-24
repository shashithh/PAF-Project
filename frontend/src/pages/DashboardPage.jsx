import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AnalyticsWidget from '../components/resources/AnalyticsWidget'
import UserManagement from './UserManagement';


const QUICK_ACTIONS = (isAdmin, navigate) => [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    label: 'Resources Catalogue',
    desc: 'Browse, search, and filter all campus assets',
    color: 'primary',
    action: () => navigate('/resources'),
  },
  ...(isAdmin ? [{
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
      </svg>
    ),
    label: 'Add New Resource',
    desc: 'Register a new facility or asset',
    color: 'teal',
    action: () => navigate('/resources/new'),
  }] : []),
]

const colorMap = {
  primary: {
    bg: 'bg-primary-50 hover:bg-primary-100',
    border: 'border-primary-200 hover:border-primary-300',
    icon: 'bg-primary-600 text-white',
    label: 'text-primary-800',
    desc: 'text-primary-600',
  },
  teal: {
    bg: 'bg-teal-50 hover:bg-teal-100',
    border: 'border-teal-200 hover:border-teal-300',
    icon: 'bg-teal-600 text-white',
    label: 'text-teal-800',
    desc: 'text-teal-600',
  },
}

export default function DashboardPage() {
  const { auth, isAdmin } = useAuth()
  const navigate = useNavigate()
  const actions = QUICK_ACTIONS(isAdmin, navigate)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">

      {/* Hero welcome */}
      <div className="card p-8 bg-gradient-to-br from-primary-700 to-teal-700 border-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-24 translate-x-24 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full bg-white/5 translate-y-16 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-primary-100 text-sm font-medium mb-1">{greeting} 👋</p>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {auth?.username}
          </h1>
          <p className="text-primary-100 text-sm">
            Welcome to Campusora — Facilities & Assets Catalogue
          </p>
          <div className="flex items-center gap-3 mt-5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold
              ${isAdmin ? 'bg-white/20 text-white' : 'bg-white/20 text-white'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse-dot" />
              {auth?.role} — Module A
            </span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="section-title mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map(action => {
            const c = colorMap[action.color]
            return (
              <button
                key={action.label}
                onClick={action.action}
                className={`${c.bg} ${c.border} border rounded-2xl p-6 text-left transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md group`}
              >
                <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center mb-4 shadow-sm`}>
                  {action.icon}
                </div>
                <p className={`text-base font-bold ${c.label} mb-1`}>{action.label}</p>
                <p className={`text-sm ${c.desc}`}>{action.desc}</p>
                <div className="flex items-center gap-1 mt-4">
                  <span className={`text-xs font-semibold ${c.desc}`}>Open</span>
                  <svg className={`w-3.5 h-3.5 ${c.desc} transition-transform group-hover:translate-x-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            )
          })}

          {!isAdmin && (
            <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-xl bg-gold-500 flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-base font-bold text-gold-800 mb-1">Read-only Access</p>
              <p className="text-sm text-gold-600">You have USER role — you can browse and view the resource catalogue.</p>
            </div>
          )}
        </div>
      </div>

      {/* Analytics (admin) */}
      {isAdmin && (
        <div>
          <h2 className="section-title mb-4">Resource Analytics</h2>
          <AnalyticsWidget />
        </div>
      )}

      {/* Info for user */}
      {!isAdmin && (
        <div className="card p-6 border-gold-200 bg-gold-50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gold-800 mb-1">User Access Level</p>
              <p className="text-sm text-gold-700">
                You are logged in as a USER. You can browse and search the resource catalogue,
                but creating, editing, or deleting resources requires ADMIN privileges.
                Analytics are available to admin users only.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
