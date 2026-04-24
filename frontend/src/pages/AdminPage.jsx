import React, { useState, useMemo } from 'react'
import {
  LayoutDashboard, Clock, CheckCircle, XCircle,
  CalendarDays, User, MapPin, Check, X,
  Monitor, FlaskConical, Projector, DoorOpen, BookOpen,
  MessageSquare
} from 'lucide-react'
import { useBookingContext } from '../context/BookingContext.jsx'
import '../styles/flow.css'

const TYPE_ICONS = {
  'Computer Lab A':     Monitor,
  'Computer Lab B':     Monitor,
  'Conference Room 101':DoorOpen,
  'Physics Lab':        FlaskConical,
  'Projector Kit #3':   Projector,
}

const fmtDate = d => d
  ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  : ''

export default function AdminPage() {
  const { bookings, loading, stats, updateBookingStatus } = useBookingContext()
  const [filter, setFilter] = useState('All')
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const displayed = useMemo(() =>
    filter === 'All' ? bookings : bookings.filter(b => b.status === filter.toUpperCase()),
    [bookings, filter]
  )

  return (
    <div className="flow-page">
      <div className="flow-inner">
        <div className="page-header">
          <h1 className="page-title">Admin panel</h1>
          <p className="page-sub">Review and manage all campus resource bookings.</p>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {[
            { key: 'total',    label: 'Total',    num: stats.TOTAL,    Icon: LayoutDashboard, cls: 'stat-total'    },
            { key: 'pending',  label: 'Pending',  num: stats.PENDING,  Icon: Clock,           cls: 'stat-pending'  },
            { key: 'approved', label: 'Approved', num: stats.APPROVED, Icon: CheckCircle,     cls: 'stat-approved' },
            { key: 'rejected', label: 'Rejected', num: stats.REJECTED, Icon: XCircle,         cls: 'stat-rejected' },
          ].map(({ key, label, num, Icon, cls }) => (
            <div key={key} className={`stat-card ${cls}`}>
              <div className="stat-icon"><Icon size={18} strokeWidth={2} /></div>
              <span className="stat-num">{num}</span>
              <span className="stat-lbl">{label}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs" style={{ marginBottom: '1.75rem' }}>
          {['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map(t => (
            <button
              key={t}
              className={`filter-tab${filter === t ? ' active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t}
              {t !== 'All' && stats[t.toUpperCase()] > 0 && (
                <span className="filter-tab-count">{stats[t.toUpperCase()]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="bookings-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="res-skel" style={{ height: 200 }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && displayed.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><BookOpen size={26} strokeWidth={1.5} /></div>
            <p className="empty-title">No {filter.toLowerCase()} bookings</p>
          </div>
        )}

        {/* Cards */}
        {!loading && displayed.length > 0 && (
          <div className="bookings-grid">
            {displayed.map(b => {
              const Icon = TYPE_ICONS[b.resourceName] ?? BookOpen
              return (
                <div key={b.id} className="bk-card">
                  <div className="bk-card-top">
                    <div className="bk-res-row">
                      <div className="bk-res-icon">
                        <Icon size={18} strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="bk-res-name">{b.resourceName}</div>
                        <div className="bk-res-loc">
                          <User size={11} strokeWidth={2} />
                          {b.userName}
                        </div>
                      </div>
                    </div>
                    <span className={`badge badge-${b.status.toLowerCase()}`}>
                      {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                    </span>
                  </div>

                  <div className="bk-divider" />

                  <div className="bk-date-row">
                    <div className="bk-date">
                      <CalendarDays size={14} strokeWidth={2} />
                      {fmtDate(b.date)}
                    </div>
                    <div className="bk-time">
                      <Clock size={13} strokeWidth={2} />
                      {b.startTime} – {b.endTime}
                    </div>
                  </div>

                  {b.purpose && (
                    <div className="bk-purpose">"{b.purpose}"</div>
                  )}

                  {/* Admin actions */}
                  {b.status === 'PENDING' && (
                    rejectingId === b.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '.25rem' }}>
                        <input
                          className="input"
                          placeholder="Reason for rejection (optional)"
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          autoFocus
                        />
                        <div style={{ display: 'flex', gap: '.5rem' }}>
                          <button
                            className="btn btn-danger btn-sm"
                            style={{ flex: 1 }}
                            onClick={() => {
                              updateBookingStatus(b.id, 'REJECTED', rejectReason.trim() || null)
                              setRejectingId(null)
                              setRejectReason('')
                            }}
                          >
                            <X size={13} strokeWidth={2.5} />
                            Confirm reject
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => { setRejectingId(null); setRejectReason('') }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="admin-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => updateBookingStatus(b.id, 'APPROVED', null)}
                        >
                          <Check size={13} strokeWidth={2.5} />
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => setRejectingId(b.id)}
                        >
                          <X size={13} strokeWidth={2.5} />
                          Reject
                        </button>
                      </div>
                    )
                  )}

                  {/* Show rejection reason if present */}
                  {b.status === 'REJECTED' && b.rejectionReason && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.4rem', padding: '.6rem .75rem', background: 'var(--red-light)', borderRadius: 'var(--radius-xs)', fontSize: '.82rem', color: '#b91c1c' }}>
                      <MessageSquare size={13} strokeWidth={2} style={{ flexShrink: 0, marginTop: '.1rem' }} />
                      <span><strong>Reason:</strong> {b.rejectionReason}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
