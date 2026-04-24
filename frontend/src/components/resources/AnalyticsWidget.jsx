import React, { useEffect, useState } from 'react'
import { fetchAnalytics } from '../../services/resourceApi'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

const TYPE_CONFIG = {
  LECTURE_HALL: { label: 'Lecture Halls', color: 'bg-violet-500', light: 'bg-violet-100', text: 'text-violet-700' },
  LAB:          { label: 'Labs',          color: 'bg-blue-500',   light: 'bg-blue-100',   text: 'text-blue-700' },
  MEETING_ROOM: { label: 'Meeting Rooms', color: 'bg-amber-500',  light: 'bg-amber-100',  text: 'text-amber-700' },
  PROJECTOR:    { label: 'Projectors',    color: 'bg-cyan-500',   light: 'bg-cyan-100',   text: 'text-cyan-700' },
  CAMERA:       { label: 'Cameras',       color: 'bg-pink-500',   light: 'bg-pink-100',   text: 'text-pink-700' },
  OTHER:        { label: 'Other',         color: 'bg-surface-border', light: 'bg-surface-muted', text: 'text-ink-secondary' },
}

const STAT_CARDS = (data) => [
  {
    label: 'Total Resources',
    value: data.totalResources,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    valueColor: 'text-primary-700',
  },
  {
    label: 'Active',
    value: data.activeResources,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    valueColor: 'text-teal-700',
  },
  {
    label: 'Out of Service',
    value: data.outOfServiceResources,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-500',
    valueColor: 'text-rose-600',
  },
]

export default function AnalyticsWidget() {
  const { auth } = useAuth()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchAnalytics(auth)
      .then(res => { if (!cancelled) setData(res.data) })
      .catch(() => { if (!cancelled) setError('Could not load analytics.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [auth])

  if (loading) return <LoadingSpinner message="Loading analytics…" />
  if (error)   return <p className="text-sm text-rose-500 font-medium">{error}</p>
  if (!data)   return null

  const total = data.totalResources || 0
  const cards = STAT_CARDS(data)

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(card => (
          <div key={card.label} className="card p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center ${card.iconColor} flex-shrink-0`}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs text-ink-muted font-medium mb-0.5">{card.label}</p>
              <p className={`text-3xl font-bold stat-number ${card.valueColor}`}>{card.value ?? 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Type breakdown */}
      <div className="card p-6">
        <h3 className="text-sm font-bold text-ink mb-5">Resources by Type</h3>
        <div className="space-y-3.5">
          {Object.entries(data.resourcesByType || {}).map(([type, count]) => {
            const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.OTHER
            const pct = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={type} className="flex items-center gap-4">
                <span className={`w-28 text-xs font-semibold ${cfg.text} flex-shrink-0`}>{cfg.label}</span>
                <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${cfg.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 min-w-[60px] justify-end">
                  <span className="text-xs font-semibold text-ink">{count}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.light} ${cfg.text}`}>{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
